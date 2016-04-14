/**
 * @file 提供对移动元素渲染的动画优化处理
 * @author 张少龙
 */
define(function () {

    'use strict';

    // 上一次执行的时间戳
    var lastTime = 0;
    // 私有浏览器前缀
    var prefixes = ['webkit', 'moz', 'ms', 'o'];
    var requestAnimationFrame = window.requestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame;

    // 修复不同浏览器的私有支持
    (function () {
        for (var i = 0, len = prefixes.length; i < len; i++) {
            if (requestAnimationFrame) {
                return;
            }
            requestAnimationFrame = window[prefixes[i] + 'RequestAnimationFrame'];
            cancelAnimationFrame = window[prefixes[i] + 'CancelAnimationFrame'] || window[prefixes[i] + 'CancelRequestAnimationFrame'];
        }

        if (!requestAnimationFrame) {
            requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - currTime + lastTime); 
                lastTime = currTime + timeToCall;
                return window.setTimeout(function () {
                    callback(lastTime);
                }, timeToCall);
            };
        }
        if (!cancelAnimationFrame) cancelAnimationFrame = function (timer) {
            window.clearTimeout(timer);
        };
    })();

    return {
        requestAnimationFrame: function (callback) {
            return requestAnimationFrame.call(window, callback);
        },
        cancelAnimationFrame: function (timer) {
            cancelAnimationFrame.call(window, timer);
        }
    };
});