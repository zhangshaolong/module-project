define(function (require) {

    require('tpl!./dialog.tpl');
    require('css!./dialog.less');

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
            this.dialog.on('click', '.cancel', function () {
                me.fire('cancel');
            });

            this.dialog.on('click', '.close', function () {
                me.fire('cancel');
            });
        },
        render: function (data) {
            data = $.extend(data, this);
            var dialog = this.dialog = $(Simplite.render('dialog-template', data));
            this.context.append(dialog);
            dialog.addClass('dialog-widget');
        },
        show: function () {
            this.dialog.modal({
                show: true,
                backdrop:'static'
            });
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
        },
        destroy: function () {
            this.dialog.remove();
            $('.modal-backdrop').remove();
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