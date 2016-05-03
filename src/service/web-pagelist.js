/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    exports.getProducts = function (params) {
        return ajax.post('/compute-api/web/productlist', params);
    };

    exports.getPageList = function (params) {
        return ajax.post('/compute-api/web/pagelist', params);
    };
});