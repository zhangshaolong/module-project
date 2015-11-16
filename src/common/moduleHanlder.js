/**
 * @file 抓取页面上的模块，设置模块对应的js的查找范围域，进一步降低多模块的冲突可能性
 *       目前只扫描path，后期根据业务复杂度再进一步设计需要交互数据等的方式
 * @author zhangshaolong
 */

define(function (require, exports) {

    'use strict';

    var eventEmitter = require('./eventEmitter');

    exports.init = function (context) {
        context = context || $('body');
        var size = context.size();
        if (size > 1) {
            $.each(context, function () {
                exports.init($(this));
            });
        } else if (size === 1) {
            var path = context.data('modulePath');
            if (path) {
                exports.load(path, context);
            } else {
                exports.init(context.children());
            }
        }
    };

    exports.load = function (path, moduleNode) {
        var interceptorPath = moduleNode.data('interceptorPath');
        var caller = {
            element: moduleNode,
            eventEmitter: eventEmitter,
            data: moduleNode.data()
        };
        var loadModule = function (path, data) {
            require([path], function (factory) {
                if (factory && $.isFunction(factory.init)) {
                    var deferred = factory.init.call(caller, data);
                    if (deferred && $.isFunction(deferred.done)) {
                        deferred.done(function () {
                            exports.init(moduleNode.children());
                        })
                    } else {
                        exports.init(moduleNode.children());
                    }
                }
            });
        };
        if (interceptorPath) {
            require([interceptorPath], function (interceptorFactory) {
                if (interceptorFactory && $.isFunction(interceptorFactory.init)) {

                    var deferred = interceptorFactory.init.call(caller);
                    if (deferred.done) {
                        deferred.done(function (data) {
                            loadModule(path, data);
                        });
                    } else {
                        loadModule(path, deferred);
                    }
                } else {
                    loadModule(path);
                }
            });
        } else {
            loadModule(path);
        }
    };

    /**
     * 设计这个方法的目的是在元素添加html内容后，自动扫描并初始化html中的data-module-path模块
     */
    exports.add = function (moduleNode, moduleHtml) {
        moduleNode.html(moduleHtml);
        exports.init(moduleNode.children());
    };
})