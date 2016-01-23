/**
 * 对应的一个页面内的所有api接口
 *
 */

define(function (require, exports) {

    var ajax = require('service/ajax');

    /**
     * 获取所有任务数据
     */
    exports.getTaskList = function (options) {
        return ajax.post('/module-project/task/list', null, options);
    };
});