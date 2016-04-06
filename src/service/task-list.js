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
        // jsonp的使用方式请参考此处的mock
        return ajax.jsonp('/api-prefix/task/list', {
            ts: new Date().getTime()
        }, options);
    };
});