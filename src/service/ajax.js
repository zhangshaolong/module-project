define(function (require, exports) {

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
        options = options || {};
        params = params || {};
        return $.ajax({
            url: url,
            // data: JSON.stringify(params),
            data: params,
            method: 'POST',
            type: 'POST',
            dataType: 'json',
            timeout: 20000,
            beforeSend: options.beforeSend || function () {
                var time = new Date().getTime();
                options._time = time;
                options.holder && options.holder.append('<div class="loading loading-' + time + '">').addClass('relative');
            },

            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            // contentType: 'application/json;charset=UTF-8',
            async: options.sync ? false : true
        }).pipe(function (response) {
            options.holder && options.holder.removeClass('relative').find('.loading-' + options._time).remove();
            if (response.err_no === 0) {
                return response;
            } else {
                if (response.err_no === 302) {
                    var config = {
                        online: 'http://mis.diditaxi.com.cn/auth/sso/login?app_id=94',
                        offline: 'http://mis-test.diditaxi.com.cn/auth/sso/login?app_id=99'
                    };
                    var pagePath = encodeURIComponent(location.href);
                    location.href = config.online + '&version=1.0&jumpto=' + pagePath;
                } else {
                    var deferred = $.Deferred();
                    deferred.reject(response);
                    return deferred.promise();
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
            data: params,
            dataType: 'jsonp',
            timeout: timeout,
            scriptCharset: 'UTF-8'
        }).pipe(function (response) {
            if (response.err_no === 0) {
                return response;
            } else {
                if (response.err_no === 302) {
                    var config = {
                        online: 'http://mis.diditaxi.com.cn/auth/sso/login?app_id=94',
                        offline: 'http://mis-test.diditaxi.com.cn/auth/sso/login?app_id=99'
                    };
                    var pagePath = encodeURIComponent(location.href);
                    location.href = config.online + '&version=1.0&jumpto=' + pagePath;
                } else {
                    var deferred = $.Deferred();
                    if (commonErrors[response.err_no]) {
                        deferred.reject(response);
                    } else {
                        deferred.reject(response);
                    }
                    return deferred.promise();
                }
            }
        });
    };
});