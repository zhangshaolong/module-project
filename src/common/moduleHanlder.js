/**
 * @file 抓取页面上的模块，设置模块对应的js的查找范围域，进一步降低多模块的冲突可能性
 *       目前只扫描path，后期根据业务复杂度再进一步设计需要交互数据等的方式
 * @author zhangshaolong
 */

define(function (require, exports) {

    'use strict';

    var eventEmitter = require('./eventEmitter');
    var store = require('./store');

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
            data: moduleNode.data(),
            store: store
        };
        var execModule = function (factory, data) {
            if (factory && $.isFunction(factory.init)) {
                var deferred = factory.init.call(caller, data);
                if (deferred && deferred.done) {
                    deferred.done(function (data) {
                        exports.init(moduleNode.children());
                    });
                } else {
                    exports.init(moduleNode.children());
                }
            }
        };

        require([path], function (factory) {
            if (interceptorPath) {
                require([interceptorPath], function (interceptorFactory) {
                    if (interceptorFactory && $.isFunction(interceptorFactory.init)) {
                        var deferred = interceptorFactory.init.call(caller);
                        if (deferred && deferred.done) {
                            deferred.done(function (data) {
                                execModule(factory, data);
                            });
                        } else {
                            execModule(factory, deferred);
                        }
                    } else {
                        execModule(factory);
                    }
                });
            } else {
                execModule(factory);
            }
        });
    };
})