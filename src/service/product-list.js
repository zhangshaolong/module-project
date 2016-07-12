/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    /**
     * 获取所有业务线数据
     */
    exports.getProductList = function (options) {
        return ajax.post('/api-prefix/product/list', null, options);
    };

    // restful形式，注意：需要在params里面有id参数
    exports.deleteProduct = function (params, options) {
        return ajax.post('/api-prefix/product/delete/{id}', params, options);
    };
});