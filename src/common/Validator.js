/**
 * @file 元素验证器，支持对Deferred和同步验证的兼容处理
 * @author 张少龙
 */

/**
    使用方式：
        Dom元素：（必须有data-validate-name属性，默认trigger为change）
            <input type="text" data-validate-name="a" data-validate-trigger="change" />

        JS调用：
            var v = new Validator({
                rules: { // rules下定义一些通用的验证规则供具体元素验证用
                    required: function (isRequired) {
                        var val = this.value;
                        if (isRequired === 'false') {
                            if (!val) {
                                return {
                                    force: true
                                }
                            } else {
                                return true;
                            }
                        } else {
                            return val.length > 0;
                        }
                    },
                    max: function (maxVal) {
                        return +this.value <= maxVal;
                    },
                    range: function (min, max) {
                        return +this.value > +min && +this.value < +max;
                    }
                },


                elements: { // 使用data-validate-name定义的值与这里的key一一对应，数组中支持字符串规则和function规则
                            // 验证器负责Deferred与非Deferred的统一解析，并把返回结果解析成Deferred
                    a: ['required:true', 'max:100', {remoteCheck: function (val) {return service.check(val);}}],
                    b: []
                },


                notifier: { // 所有的验证结果处理器，按照data-validate-name定义的值与这里的key一一对应
                    '*': function () { // *表示通用的处理
                        $(this).next().html('sddffd');
                    },
                    a: function (result, ruleName) {
                        if (result) {
                            // 当验证通过时业务处理逻辑
                        } else {
                            if (type === 'required') {
                                // 处理required错误提示逻辑
                            }
                        }
                    }
                },

                vals: { // 如果某个验证元素的值不是默认的value属性，那么可以定义在这里面获取。
                    a: function (element) {
                        return $(element).html();
                    }
                }
            });

            // 调用init方法，自动扫描并挂接验证规则，在scopeElement子元素中扫描，默认body。
            v.init(scopeElement);
*/
(function (root, factory) {
    var Validator = factory();
    if (typeof define === 'function') {
        define(function () {
            return Validator;
        });
    } else if (typeof require === 'undefined') {
        root.Validator = Validator;
    }
})(this, function () {

    var validateReg = /^validate([A-Z])/;

    var methodReg = /\s*\:\s*/;

    var argReg = /\s*,\s*/;

    /**
     * jquery 事件命名空间
     *
     * @inner
     * @type {string}
     */
    var namespace = '.for-validator';

    var parseElement = function (element) {
        var $element = $(element);
        var validateOptions = {
            element: $element[0]
        };
        if (!$element[0]) {
            if (typeof element === 'string') {
                validateOptions.name = $.trim(element);
            }
            return validateOptions;
        }
        var options = $element.data();
        $.each(options, function (key, value) {
            if (validateReg.test(key)) {
                validateOptions[key.replace(validateReg, function (all, upper) {
                    return upper.toLowerCase();
                })] = value;
            }
        });
        return validateOptions;
    };

    var Validator = function (options) {
        $.extend(this, options);
        this.verifies = {};
    };

    Validator.prototype.init = function (context) {

        context = $(context || 'body');

        var me = this;

        var verifies = context.find('[data-validate-name]');

        verifies.each(function () {
            me.add(this);
        });

        return me;
    };

    Validator.prototype.add = function (element, options) {
        var me = this;
        var elementOptions = parseElement(element);
        var name = elementOptions.name;
        var commonOptions = {
            element: elementOptions.element,
            rules: me.elements[name],
            notifier: me.notifier[name] || me.notifier['*']
        };
        var val = me.vals && me.vals[name];
        if (val) {
            commonOptions.val = val;
        }
        options = $.extend({}, commonOptions, options, elementOptions);
        var verify = this.verifies[name] = new Verify(options);

        if (verify.element) {
            $(verify.element).on((verify.trigger || 'change') + namespace, function () {
                me.validate(name);
            });
        }
    };

    Validator.prototype.remove = function (name) {
        var verify = this.verifies[name];
        if (verify) {
            delete this.verifies[name];
            delete this.elements[name];
            delete this.notifier[name];
            this.vals && (delete this.vals[name]);
            $(verify.element).off((verify.trigger || 'change') + namespace);
        }
    };

    Validator.prototype.parseResponse = function (response) {
        if (typeof response === 'boolean') {
            return response;
        }
        return !response.code && response.data;
    };

    Validator.prototype.validate = function (name) {
        var deferred = $.Deferred();
        var me = this;
        if (!name) {
            var defs = [];
            $.each(this.verifies, function (key) {
                defs.push(me.validate(key));
            });
            $.when.apply(null, defs).done(function () {
                var isValid = true;
                $.each(arguments, function (idx, result) {
                    if (!result) {
                        return isValid = false;
                    }
                });
                deferred.resolve(isValid);
            });
        } else {
            var verify = me.verifies[name];
            var rules = verify.rules;
            var notifier = verify.notifier;
            var len = rules.length;
            var element = verify.element;

            var validate = function (idx) {
                var rule = rules[idx];
                var methodName = null;
                var args = null;
                if (typeof rule === 'string') {
                    var methodNameAndArgs = rule.split(methodReg);
                    methodName = methodNameAndArgs[0];
                    if (methodNameAndArgs[1]) {
                        args = methodNameAndArgs[1].split(argReg);
                    }
                    rule = me.rules[methodName];
                } else {
                    for (methodName in rule) {
                        rule = rule[methodName];
                        break;
                    }
                }
                var val = verify.val(verify.element);
                var result = rule.apply({
                    element: verify.element,
                    value: val,
                    args: args
                }, args || [val]);

                var deal = function (result) {
                    if (idx === len - 1) {
                        deferred.resolve(result);
                        notifier.call(element, result, methodName, name);
                    } else {
                        if (!result) {
                            deferred.resolve(false);
                            notifier.call(element, false, methodName, name);
                        } else if (result.force) {
                            deferred.resolve(true);
                            notifier.call(element, true, methodName, name);
                        } else {
                            validate(idx + 1);
                        }
                    }
                };
                if (result.done) {
                    result.done(function (resp) {
                        deal(me.parseResponse.call({
                            element: element,
                            methodName: methodName,
                            name: name
                        }, resp));
                    });
                } else {
                    deal(result);
                }
            };

            validate(0);
        }

        return deferred.promise();
    };

    var Verify = function (options) {
        $.extend(this, options);
    };

    Verify.prototype.val = function () {
        return $.trim($(this.element).val());
    };

    return Validator;
});
