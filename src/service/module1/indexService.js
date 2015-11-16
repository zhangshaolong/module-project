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
    exports.getSomeData = function (id) {
        return ajax.post('/module1/common/user.ajax', {
            id: id
        });
    };
});