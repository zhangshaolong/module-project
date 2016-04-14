/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    exports.getTaskList = function (param) {
        return ajax.post('/omega-compute/compute-api/get_task_list', param);
    };

    exports.getHistoryTaskList = function (param) {
        return ajax.post('/omega-compute/compute-api/get_task_history_list', param);
    };

    exports.opTask = function (param) {
        return ajax.post('/omega-compute/compute-api/operate_task', param);
    };

});