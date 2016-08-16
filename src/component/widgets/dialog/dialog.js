define(function (require) {

    require('tpl!./dialog.tpl');

    var Dialog = require('../../ui').create({
        init: function () {
            this.context = $(this.context);
            this.render(this.data);
        },
        bindEvent: function () {
            var me = this;
            this.dialog.on('click', '.ok', function (e) {
                me.fire('ok');
                
            });
        },
        render: function (data) {
            data = $.extend(data, this);
            var dialog = this.dialog = $(Simplite.render('dialog-template', data));
            this.context.append(dialog);
        },
        show: function () {
            this.dialog.modal('show');
        },
        hide: function () {
            this.dialog.modal('hide');
        },
        setTitle: function (title) {
            this.dialog.find('.modal-title').html(title);
        },
        setContent: function (content) {
            this.dialog.find('.modal-body').html(content);
        },
        find: function (rule) {
            return this.dialog.find(rule);
        }
    });

    Dialog.defaultOptions = {
        context: 'body',
        actions: ['ok', 'cancel'],
        buttons: {
            ok: {
                text: '确定'
            },
            cancel: {
                text: '取消'
            }
        }
    };

    return Dialog;
});