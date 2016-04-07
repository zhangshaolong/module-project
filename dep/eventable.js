/**
 * 事件监听机制实现类，可使用on绑定事件
 * @return {object} 返回事件对象
 *      {object.on} 绑定事件接口（key，task）
 *      {object.un} 注销事件接口（key，task）
 *      {object.fire} 触发事件接口（key, args.....）
 *
 * author zhangshaolong
 */

define(function (require, exports) {

    var slice = Array.prototype.slice;

    return require('./class').create({
        init: function () {
            this.taskMap = {};
        },
        on: function (key, task) {
            if (!key || !task) {
                return false;
            }
            var taskQueue = this.taskMap[key];
            if (!taskQueue) {
                taskQueue = this.taskMap[key] = [];
            }
            taskQueue.push(task);
            return function () {
                for (var i = 0; i < taskQueue.length; i++) {
                    if (taskQueue[i] === task) {
                        taskQueue.splice(i--, 1);
                    }
                }
            };
        },
        un: function (key, task) {
            if (!key) {
                this.taskMap = {};
                return false;
            }
            var taskQueue = this.taskMap[key];
            if (!taskQueue) {
                return false;
            }
            if (!task) {
                taskQueue.length = 0;
                return true;
            }
            var has = false;
            for (var i = 0; i < taskQueue.length; i++) {
                if (taskQueue[i] === task) {
                    taskQueue.splice(i--, 1);
                    has = true;
                }
            }
            return has;
        },
        fire: function (key) {
            var taskMap = this.taskMap;
            var args = slice.call(arguments, 1);
            setTimeout(function () {
                if (!key) {
                    return false;
                }
                var taskQueue = taskMap[key];
                if (!taskQueue) {
                    return false;
                }
                var len = taskQueue.length;
                if (len === 0) {
                    return false;
                }
                for (var i = 0; i < taskQueue.length; i++) {
                    taskQueue[i].apply(null, args);
                }
            }, 0);
        }
    });
});