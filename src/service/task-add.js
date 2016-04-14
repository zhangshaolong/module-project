/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    exports.getTaskTpl = function (param) {
        return ajax.post('/omega-compute/compute-api/get_task_tpl', param);
    };

    exports.addTask = function (param) {
        return ajax.post('/omega-compute/compute-api/add_task', param);
    };

    exports.getTaskTypeList = function (param) {
        return ajax.post('/omega-compute/compute-api/get_task_type_list', param);
    }
});