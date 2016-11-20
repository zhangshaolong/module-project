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
            var eventEmitter = require('./eventEmitter').init();
            this.tasks = eventEmitter.tasks;
            this.fired = eventEmitter.fired;
            this.on = eventEmitter.on;
            this.un = eventEmitter.un;
            this.fire = function () {
                var args = arguments;
                setTimeout(function () {
                    eventEmitter.fire.apply(eventEmitter, args);
                }, 0);
            };
        }
    });
});