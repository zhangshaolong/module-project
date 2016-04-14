define(function (require) {

    var UI = require('dep/eventable').create({
        init: function (options) {
            var me = this;
            this.element = $(this.element);
            this.on('init', function () {
                if (me.bindEvent) {
                    me.bindEvent();
                }
            });
            this.fire('init', arguments);
        },
        dispose: function () {
            this.element.remove();
            this.fire('dispose');
        }
    });
    return UI;
});