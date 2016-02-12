/**
 * @file 面向对象实现继承，子类会自动继承父类的行为
 * @author：张少龙（zhangshaolongjj@163.com）
 */
(function (root, factory) {
    var clazz = factory();
    if (typeof define === 'function') {
        define(function () {
            return clazz;
        });
    } else {
        root.Class = clazz;
    }
})(this, function () {
    'use strict'
    /**
     * 空函数，用来为子类继承方法
     */
    var noop = function () {};
    /**
     * 获取父类的方法
     */
    var callSuper = function (method) {
        var me = this;
        return function () {
            me.superClass.prototype[method].apply(me, arguments);
        };
    }
    /**
     * 类实例化对象的方法
     * @private param {object} options 实例化对象时的配置参数
     * @return {instance} 返回实例对象
     */
    var init = function (options) { // 暂时只支持1个参数
        return new this(options);
    };
    var Root = {
        /**
         * @param {methods}，{key} method名字，{value} method 或者 {object}
         * {methods}.{value}为{object}时，{object}结构
         *      {
         *          override: true,（可选）是否重写父类同名方法
         *          handler:  method
         *      }
         *  @return {Class的子类} 返回调用者的子类
         */
        create: function (Parent, methods) {
            var parent = null;
            if (Root !== this) {
                parent = this;
            }
            // 仅当是Root.create时，允许传入父类
            if (parent === null) {
                if (typeof Parent === 'function') {
                    parent = Parent;
                } else {
                    methods = Parent;
                    Parent = null;
                }
            } else if (!methods) {
                methods = Parent;
                Parent = null;
            }
            methods = methods || {};
            var F = function () {
                // if (parent) {
                //     var p = parent;
                //     while (p) {
                //          if (p.prototype.init) {
                //             p.prototype.init.apply(this, arguments);
                //          }
                //         p = p.prototype.superClass;
                //     }
                // }
                for (var key in F.defaultOptions || {}) {
                    if (!this[key]) {
                        this[key] = F.defaultOptions[key];
                    }
                }
                this.init.apply(this, arguments);
            };
            if (parent) {
                noop.prototype = parent.prototype;
                F.prototype = new noop();
                noop.prototype = null;
            }
            F.prototype.init = function (options) {
                options = options || {};
                for(var p in options) {
                    this[p] = options[p];
                }
            };
            for (var name in methods) {
                if (methods.hasOwnProperty(name)) {
                    var method = methods[name];
                    var override = false;
                    if (typeof method !== 'function') {
                        override = method.override;
                        method = method.handler;
                    }
                    F.prototype[name] = function (method, parent, name, override) {
                        return function () {
                            if (!override) {
                                var pMethod;
                                if (parent) {
                                    pMethod = parent.prototype[name];
                                    if (!pMethod) {
                                        parent = parent.superClass;
                                        if (parent) {
                                            parent.prototype[name].apply(this, arguments);
                                        }
                                    } else {
                                        pMethod.apply(this, arguments);
                                    }
                                }
                            }
                            return method.apply(this, arguments);
                        };
                    }(method, parent, name, override);
                }
            }
            if (parent) {
                F.prototype.superClass = parent;
                F.prototype.constructor = F;
                F.prototype.callSuper = callSuper;
            }
            F.create = Root.create;
            F.init = init;
            return F;
        }
    };
    return Root.create();
});