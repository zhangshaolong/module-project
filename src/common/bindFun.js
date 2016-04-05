/**
 * @file 提供对一些高频调用的函数进行优化，降低js调用频率，排除不必要的干扰因素
 * @author 张少龙
 */
define(function () {

    'use strict';

    /**
     * 判断是否是注册滚动事件的元素触发的滚动事件
     * element 被监听滚动的元素
     * event 滚动事件的事件对象
     */
    var isElementSelf = function (element, event) {
        return element === event.target || (element === window && event.target === document);
    };

    /**
     * 清除队列中未执行的任务，终止这些不满足条件的调用
     */
    var clearTimerQueue = function (timerQueue) {
        // 保证最后一个会被调用到
        while (timerQueue.length > 1) {
            clearTimeout(timerQueue.shift());
        }
    };

    /**
     * element 被监听滚动的元素 必需
     * type    事件类型
     * handler 滚动时，调用的函数   必需
     * timeInterval 每隔timeInterval，最多执行一次handler的函数调用，此字段设置为非负数数字时有效
     * watchAll 是否触发其他元素的滚动条事件
     */
    return function (element, type, handler, timeInterval, watchAll) {
        var invokeTimerQueue = [];
        var fun = null;
        var $element = $(element);
        element = $element[0];
        if (isNaN(timeInterval) || timeInterval < 0) {
            if (watchAll) {
                fun = handler;
            } else {
                fun = function (event) {
                    if (isElementSelf(element, event)) {
                        handler(event);
                    }
                };
            }
        } else {
            if (watchAll) {
                fun = function (event) {
                    invokeTimerQueue.push(
                        setTimeout(
                            function () {
                                clearTimerQueue(invokeTimerQueue);
                                handler(event);
                            }, 
                            timeInterval
                        )
                    );
                };
            } else {
                fun = function (event) {
                    invokeTimerQueue.push(
                        setTimeout(
                            function () {
                                clearTimerQueue(invokeTimerQueue);
                                if (isElementSelf(element, event)) {
                                    handler(event);
                                }
                            }, 
                            timeInterval
                        )
                    );
                };
            }
        }
        $element[type](fun);
    };
});