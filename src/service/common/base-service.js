/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    /**
     * 获取某个模块数据
     * @param {Object} params
     */
    exports.getData = function (params, options) {
        return ajax.post('/module-project/common/base', params, options);
    };
});