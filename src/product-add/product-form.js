define(function (require, exports) {

    var service = require('service/product-add');
    var Validator = require('common/Validator');
    var productId = require('common/utils').getQuery('id');

    var getFormData = function (moduleNode) {
        var data = {};
        moduleNode.find('[name]').each(function () {
            data[this.name] = this.value;
        });
        return data;
    };

    var errors = {
        productName: {
            required: '业务线名称不能为空'
        },
        owner: {
            required: '接口人不能为空'
        },
        ownerPhone: {
            required: '接口人电话不能为空',
            phone: '请输入正确的手机号码'
        },
        ownerMail: {
            required: '接口人邮箱不能为空',
            email: '请输入正确的邮箱地址'
        }
    };

    var validator = new Validator({
        rules: {
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
            }
        },
        elements: {
            productName: ['required:true'],
            owner: ['required:true'],
            ownerPhone: ['required:true', {
                phone: function (val) {
                    return /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(val);
                }
            }],
            ownerMail: ['required::true', {
                email: function (val) {
                    return  /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(val);
                }
            }]
        },
        notifier: {
            '*': function (result, ruleName, name) {
                if (result) {
                    $(this).next().html('');
                } else {
                    $(this).next().html(errors[name][ruleName]);
                }
            }
        }
    });

    exports.init = function () {

        var moduleNode = this.element;

        if (productId) {
            service.getProduct({
                id: productId
            }).done(function (resp) {
                if (resp.status === 200) {
                    var data = resp.data;
                    var html = Simplite.render('product-add-product-form', data);
                    moduleNode.html(html);
                    validator.init(moduleNode);
                } else {
                    console.log('获取业务线表单数据出错', resp);
                }
            });
        } else {
            var html = Simplite.render('product-add-product-form', {});
            moduleNode.html(html);
            validator.init(moduleNode);
        }

        moduleNode.on('click', '.product-save', function () {

            validator.validate().done(function (result) {
                if (result) {
                    service.saveProduct(getFormData(moduleNode)).done(function (resp) {
                        if (resp.status === 200) {
                            window.location.href = '/product/list';
                        } else {
                            console.log('保存业务线数据出错', resp);
                        }
                    });
                }
            });
        })

        .on('click', '.cancel-save', function () {
            window.location.href = '/product/list';
        });
    };
});