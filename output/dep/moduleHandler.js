/**
 * @file 抓取页面上的模块，设置模块对应的js的查找范围域，进一步降低多模块的冲突可能性
 *       目前只扫描path，后期根据业务复杂度再进一步设计需要交互数据等的方式
 * @author zhangshaolong
 */

define(function (require, exports) {

    'use strict';

    var disposeModule = function (module) {
        if (!module) {
            return;
        }
        disposeParentRef(module);
        var subModules = module.subModules;
        if (!subModules) {
            return;
        }
        for (var i = 0; i < subModules.length; i++) {
            var subModule = subModules[i];
            if (subModule && $.isFunction(subModule.dispose)) {
                subModules.splice(i, 1);
                i--;
                subModule.dispose();
            }
        }
    };

    var disposeParentRef = function (module) {
        var parentModule = module.parentModule;
        if (!parentModule) {
            return;
        }
        var subModules = parentModule.subModules;
        for (var i = 0; i < subModules.length; i++) {
            var subModule = subModules[i];
            if (subModule === module) {
                subModules.splice(i, 1);
                i--;
            }
        }
    };

    exports.init = function (context, parentModule) {
        context = context || $('body');
        var size = context.size();
        if (size > 1) {
            $.each(context, function () {
                exports.init($(this), parentModule);
            });
        } else if (size === 1) {
            var path = context.data('modulePath');
            if (path) {
                exports.load(path, context, parentModule);
            } else {
                exports.init(context.children(), parentModule);
            }
        }
    };

    exports.load = function (path, moduleNode, parentModule) {
        var moduleData = moduleNode.data();
        var interceptorPath = moduleData.interceptorPath;
        var execModule = function (factory, data) {
            if (factory) {
                if ($.isFunction(factory)) {
                    factory = new factory();
                }
                factory.element = moduleNode;
                factory.data = moduleData;
                if ($.isFunction(factory.init)) {
                    var deferred = factory.init(data);
                    if (deferred && deferred.done) {
                        deferred.done(function (data) {
                            exports.init(moduleNode.children(), factory);
                        });
                    } else {
                        exports.init(moduleNode.children(), factory);
                    }
                } else {
                    exports.init(moduleNode.children(), factory);
                }
                if (parentModule) {
                    var subModules = parentModule.subModules;
                    if (!subModules) {
                        subModules = parentModule.subModules = [];
                    }
                    subModules.push(factory);
                    factory.parentModule = parentModule;
                }

                var dispose = factory.dispose;
                if ($.isFunction(dispose)) {
                    factory.dispose = function () {
                        disposeModule(this);
                        dispose.apply(this, arguments);
                    };
                } else {
                    factory.dispose = function () {
                        disposeModule(this);
                    };
                }
            }
        };

        require([path], function (factory) {
            if (interceptorPath) {
                require([interceptorPath], function (interceptorFactory) {
                    if (interceptorFactory) {
                        interceptorFactory.element = moduleNode;
                        interceptorFactory.data = moduleData;
                        if ($.isFunction(interceptorFactory.init)) {
                            var deferred = interceptorFactory.init();
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
                    }
                });
            } else {
                execModule(factory);
            }
        });
    };
})