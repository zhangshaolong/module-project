/**
 * @file 事件总线，模块间事件通知都需要经由来协调
 * author zhangshaolong
 */

define(function (require, exports) {

    var slice = Array.prototype.slice;

    var EventEmitter = function () {
        this.tasks = {};
        this.fired = {};
    };

    EventEmitter.tasks = {};
    EventEmitter.fired = {};

    EventEmitter.on = EventEmitter.prototype.on = function (key, task) {
        if (!key || !task) {
            return false;
        }
        var queue = this.tasks[key];
        if (!queue) {
            queue = this.tasks[key] = [];
            var args = this.fired[key];
            if (args) {
                task.apply(null, args);
            }
        }
        queue.push(task);
        return function () {
            for (var i = 0; i < queue.length; i++) {
                if (queue[i] === task) {
                    queue.splice(i--, 1);
                }
            }
        };
    };

    EventEmitter.fire = EventEmitter.prototype.fire = function (key) {
        var tasks = this.tasks;
        var args = slice.call(arguments, 1);
        if (!key) {
            return false;
        }
        this.fired[key] = args;
        var queue = tasks[key];
        if (!queue) {
            return false;
        }
        var len = queue.length;
        if (len === 0) {
            return false;
        }
        for (var i = 0; i < queue.length; i++) {
            queue[i].apply(null, args);
        }
    };

    EventEmitter.un = EventEmitter.prototype.un = function (key, task) {
        if (!key) {
            this.tasks = {};
            return true;
        }
        var queue = this.tasks[key];
        if (!queue) {
            return false;
        }
        if (!task) {
            queue.length = 0;
            return true;
        }
        var has = false;
        for (var i = 0; i < queue.length; i++) {
            if (queue[i] === task) {
                queue.splice(i--, 1);
                has = true;
            }
        }
        return has;
    };

    EventEmitter.once = EventEmitter.prototype.once = function (key, task) {
        var me = this;
        var handler = function () {
            task.apply(null, arguments);
            me.un(key, handler);
        }
        this.on(key, handler);
    };

    EventEmitter.init = function () {
        return new EventEmitter();
    };

    return EventEmitter;
});