/**
 * 获取用户信息等通用数据
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    exports.getUserInfo = function () {
        return ajax.post('/omega-compute/compute-api/check_login');
    };

});