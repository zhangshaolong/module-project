/**
 * @file 事件总线，模块间事件通知都需要经由来协调
 * author zhangshaolong
 */

define(function (require, exports) {

    // 直接使用jquery的on、un、one和trigger进行通讯的相关设置，只对外提供与事件相关接口，单独提取出此文件目的是为了页面内事件通知共享
    var eventEmitter = $({});

    var slice = Array.prototype.slice;

    exports.fire = function () {
        eventEmitter.trigger.apply(eventEmitter, arguments);
    };

    exports.on = function (key, fun) {
        eventEmitter.on(key, function () {
            fun.apply(null, slice.call(arguments, 1));
        });
    };

    exports.un = function () {
        eventEmitter.off.apply(eventEmitter, arguments);
    };

    exports.once = function () {
        eventEmitter.one.apply(eventEmitter, arguments);
    };
});