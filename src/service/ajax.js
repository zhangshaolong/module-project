define(function (require, exports) {

    var commonErrors = require('./commonErrors');

    var restfulReg = /\{([^\}]+)\}/g;

    var requests = [];

    $(window).bind('beforeunload', function () {
        $.each(requests, function (idx, req) {
            if (req) {
                req.abort();
            }
        });
    });

    var hasFile = function (params) {
        for (var key in params) {
            if (params[key] && params[key].constructor === File) {
                return true;
            }
        }
        return false;
    };

    var wrapParams = function (params) {
        var fd = new FormData();
        for (var key in params) {
            fd.append(key, params[key]);
        }
        return fd;
    }

    /**
     * 发送 post 请求
     *
     * @inner
     * @param {string} url 请求 url
     * @param {Object} params 发送的数据
     * @param {Object=} options
     * @property {boolean} options.sync 是否是同步请求
     * @property {Object=} options.errorHandler 自定义 error 处理
     *
     * @return {Promise}
     */
    exports.post = function (url, params, options) {
        params = params || {};
        options = options || {};
        var originalUrl = url;
        var isRestful = false;
        url = url.replace(restfulReg, function (all, key) {
            isRestful = true;
            return params[key];
        });
        if (isRestful) {
            params.__url__ = originalUrl;
        }
        url = window.rootBase + url;
        var configs = {
            url: url,
            data: params,
            method: 'POST',
            type: 'POST',
            dataType: 'json',
            cache: false,
            timeout: 20000,
            beforeSend: options.beforeSend || function () {
                var holder = options.holder;
                if (holder) {
                    var loading = holder.children('.data-loading');
                    if (!loading[0]) {
                        loading = $('<div class="data-loading data-loading" data-count="1">');
                        holder.append(loading);
                    } else {
                        loading.data('count', +loading.data('count') + 1);
                    }
                    if (holder.css('position') === 'static' && !holder.hasClass('data-loading-relative')) {
                        holder.addClass('data-loading-relative');
                    }
                }
            },
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            // contentType: 'application/json;charset=UTF-8',
            async: options.sync ? false : true
        };
        if (options.headers) {
            configs.headers = options.headers;
        }
        if (hasFile(params)) {
            configs.data = wrapParams(params);
            configs.contentType = false;
            configs.processData = false;
        }
        var deferred = $.ajax(configs);
        requests.push(deferred);
        return deferred.pipe(function (response) {
            var holder = options.holder;
            if (holder) {
                var loading = holder.children('.data-loading');
                var count = +loading.data('count');
                if (count > 1) {
                    loading.data('count', count - 1);
                } else {
                    holder.removeClass('data-loading-relative').find('.data-loading').remove();
                }
            }
            if (response.status === 200) {
                return response;
            } else {
                if (response.status === 302) { // 需要登录
                    window.location.href = window.rootBase + '/login';
                } else if (response.status === 403) { // 没有权限
                    alert('你还没有此权限，马上去申请权限~');
                } else {
                    var deferred = $.Deferred();
                    deferred.reject(response);
                    return deferred.promise();
                }
            }
        }).fail(function (response) {
            if (response.status !== 200 && response.statusText) {
                console.log(response.statusText);
            }
        }).always(function () {
            for (var i = 0; i < requests.length; i++) {
                if (requests[i] === deferred) {
                    requests.splice(i--, 1);
                }
            }
        });
    }

    /**
     * 发送跨域的 jsonp请求
     *
     * @param  {string} url
     * @param  {Object} params
     * @return {Promise}
     */
    exports.jsonp = function (url, params, timeout) {
        return $.ajax({
            url: url,
            data: JSON.stringify(params),
            dataType: 'jsonp',
            timeout: timeout,
            scriptCharset: 'UTF-8'
        }).pipe(function (response) {
            if (response.status === 200) {
                return response;
            } else {
                var deferred = $.Deferred();
                if (commonErrors[response.status]) {
                    deferred.reject(response);
                } else {
                    deferred.reject(response);
                }
                return deferred.promise();
            }
        });
    };
});