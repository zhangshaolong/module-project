define(function (require, exports) {

    var commonErrors = require('./commonErrors');

    var restfulReg = /\{([^\}]+)\}/g;

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
        return $.ajax({
            url: window.rootBase + url,
            data: JSON.stringify(params),
            method: 'POST',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            async: options.sync ? false : true,
            timeout: 20000,
            beforeSend: options.beforeSend || function () {
                var time = new Date().getTime();
                options._time = time;
                var holder = options.holder;
                if (holder) {
                    var loading = holder.children('.data-loading');
                    if (!loading[0]) {
                        loading = $('<div class="data-loading data-loading-' + time + '" data-count="1">');
                        holder.append(loading);
                    } else {
                        loading.data('count', +loading.data('count') + 1);
                    }
                    if (!holder.hasClass('data-loading-relative')) {
                        holder.addClass('data-loading-relative');
                    }
                }
            }
        }).pipe(function (response) {
            var holder = options.holder;
            if (holder) {
                var loading = holder.children('.data-loading');
                var count = +loading.data('count');
                if (count > 1) {
                    loading.data('count', count - 1);
                } else {
                    holder.removeClass('data-loading-relative').find('.data-loading-' + options._time).remove();
                }
            }
            if (response.status === 200) {
                return response;
            } else if (response.status === 302) { // 需要登录认证
                window.location.href = window.rootBase + '/login';
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