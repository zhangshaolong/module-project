/**
 * 获取一些前置数据，可以直接返回数据，或者返回一个promise，初始化的对应模块会接收到此数据
 */

define(function (require, exports) {

    var baseService = require('service/common/base-service');

    exports.init = function () {

        return baseService.getData().pipe(function (resp) {
            if (resp.status === 200) {
                return resp.data;
            }
        });

        // var deferred = $.Deferred();

        // deferred.resolve(888);

        // return deferred.promise();
    };
});