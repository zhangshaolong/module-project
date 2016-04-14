/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    exports.getTaskResult = function (param) {
        return ajax.post('/omega-compute/compute-api/get_task_result', param);
    };
});