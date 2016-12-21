define(function (require) {

    require('css!./multi-select.less');
    require('tpl!./multi-select.tpl');

    var selectedItem = function (dropdown) {
        var val = [];
        var text = [];
        dropdown.find('.chbox').each(function (idx, checkbox) {
            var $this = $(checkbox);
            if (this.checked) {
                $this.parents('.dropdown-item').addClass('active');
                val.push($this.data('id'));
                text.push($this.data('text'));
            } else {
                $this.parents('.dropdown-item').removeClass('active');
            }
        });

        if (text.length) {
            text = text.join(',');
        } else {
            text = dropdown.defaultText;
        }
        dropdown.element.find('.selected-item').data('val', val).text(text);
        if (dropdown.name) {
            dropdown.element.find('[name="' + dropdown.name + '"]').val(val.join(','));
        }
    };

    var MultiSelect = require('../../ui').create({
        init: function () {
            this.element.addClass('multi-select-widget');
            this.value = this.value || this.element.data('id');
            this.render(this.data, this.value);
        },
        bindEvent: function () {
            var me = this;
            this.element.on('click', '.dropdown-item', function (e) {
                e.stopPropagation();
                $(this).find('.chbox').trigger('click');
                return false;
            })

            .on('click', '.chbox', function (e) {
                e.stopPropagation();
                selectedItem(me);
                me.fire('change', me.getVal());
            })

            .on('click', function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            })

            .on('input', '.search-container > :text', function (e) {
                var val = $.trim(this.value);
                $(this).parent().nextAll().each(function () {
                    var data = $(this).find('.chbox').data('text') + '';
                    if (data.indexOf(val) > -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
        },
        render: function (data, val) {
            val = val || this.value;
            var html = Simplite.render('multi-select-template', {
                list: data || [],
                defaultText: this.defaultText,
                value: val,
                height: this.height,
                dropup: this.dropup,
                name: this.name,
                filterable: this.filterable
            });
            this.element.html(html);
            if (val != null) {
                this.setVal(val);
            }
        },
        setData: function (data) {
            var me = this;
            var itemsHtml = Simplite.render('multi-select-template-item', data || []);
            this.element.find('.dropdown-menu').html(itemsHtml);

            if (this.value) {
                this.setVal(this.value);
            }
        },
        setVal: function (id) {
            id = [].concat(id);
            this.find('.chbox').each(function (idx, checkbox) {
                var $this = $(checkbox);
                var val = $(this).data('id');
                var checked = false;
                $.each(id, function (i, v) {
                    if (v == val) {
                        checked = true;
                        return false;
                    }
                });
                $this.attr('checked', checked);
            });
            selectedItem(this);
        },
        getVal: function () {
            return this.element.find('.selected-item').data('val');
        },
        setDisabled: function (status) {
            if (status !== false) {
                this.element.addClass('disabled');
            } else {
                this.element.removeClass('disabled');
            }
        },
        find: function (rule) {
            return this.element.find(rule);
        }
    });

    MultiSelect.defaultOptions = {
        defaultText: '请选择'
    };

    return MultiSelect;
});