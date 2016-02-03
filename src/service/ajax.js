define(function (require, exports) {

    var commonErrors = require('./commonErrors');

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
                options.holder && options.holder.append('<div class="data-loading data-loading-' + time + '">').addClass('data-loading-relative');
            }
        }).pipe(function (response) {
            options.holder && options.holder.removeClass('data-loading-relative').find('.data-loading-' + options._time).remove();
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
            timeout: timeout
        });
    };
});