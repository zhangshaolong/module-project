/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    /**
     * 获取某个模块数据
     * @param {number} id
     */
    exports.getUserData = function (id, options) {
        options = options || {};
        return ajax.post('/projectxxx/common/user', {
            id: id
        }, options);
    };
});