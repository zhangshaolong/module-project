define(function (require) {

    require('tpl!./autocomplete.tpl');

    var Autocomplete = require('../../ui').create({
        init: function () {
            var autoConatinerNode = this.autoConatinerNode = $('<div class="widgets-autocomplete">');
            $(this.context).append(autoConatinerNode);
        },
        getDataByKey: function (key, data) {
            var result = [];
            if (!data) {
                return result;
            }
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                if (item.text && item.text.indexOf(key) > -1) {
                    result.push(item);
                }
            }
            return result;
        },
        bindEvent: function () {
            var me = this;
            var timer;
            this.element.on('input', function () {
                clearTimeout(timer);
                var ele = this;
                timer = setTimeout(function () {
                    var val = $.trim(ele.value);
                    if (val === '') {
                        me.autoConatinerNode.hide();
                        return;
                    }
                    var data = me.getDataByKey(val, me.data);
                    if (data.then) {
                        data.then(function (data) {
                            me.render(data);
                        })
                    } else if (data.length) {
                        me.render(data);
                    } else {
                        me.autoConatinerNode.hide();
                    }
                }, 30);
            })

            .on('click', function (e) {
                e.stopPropagation();
            })

            .on('keydown', function (e) {
                var code = e.keyCode;
                e.stopPropagation();
                if (code == 40 || code == 38 || code == 13) {
                    var activeNode = me.autoConatinerNode.find('.auto-item.active');
                    if (code == 13) {
                        activeNode.trigger('click');
                    }
                    if (code == 40) {
                        if (activeNode[0]) {
                            if (activeNode.next()[0]) {
                                activeNode.next().addClass('active');
                                activeNode.removeClass('active');
                            }
                        } else {
                            me.autoConatinerNode.find('.auto-item:eq(0)').addClass('active');
                        }
                    }
                    if (code == 38) {
                        if (activeNode[0]) {
                            if (activeNode.prev()[0]) {
                                activeNode.prev().addClass('active');
                                activeNode.removeClass('active');
                            }
                        } else {
                            me.autoConatinerNode.find('.auto-item:eq(0)').addClass('active');
                        }
                    }
                }
            })

            this.autoConatinerNode.on('click', '.auto-item', function (e) {
                me.element.val($(this).data('text'));
                me.element.data('id', $(this).data('id'));
                me.fire('autocomplete-selected', $(this).data());
            });
            $(document).on('click', function () {
                me.hide();
            });
        },
        render: function (data) {
            var pageHtml = Simplite.render('autocomplete-template', data || []);
            var offset = this.element.offset();
            this.autoConatinerNode.html(pageHtml).show().find('.dropdown-menu').css({
                top: offset.top + this.element[0].scrollHeight + 2,
                left: offset.left,
                display: 'block'
            });
        },
        getData: function () {
            var data = me.getDataByKey($.trim(this.element.val()), this.data);
            if (data.length === 1) {
                return data[0];
            }
        },
        hide: function () {
            this.autoConatinerNode.hide();
        },
        destroy: function () {
            $('.widgets-autocomplete').remove();
        }
    });

    Autocomplete.defaultOptions = {
        context: 'body'
    };

    return Autocomplete;
});