define(function (require) {

    require('css!./dropdown.less');
    require('tpl!./dropdown.tpl');

    var selectedItem = function ($this, dropdown) {
        if ($this[0]) {
            var oldItemNode = $this.siblings('.active');
            if (oldItemNode[0] !== $this[0]) {
                var data = $this.data();
                oldItemNode.removeClass('active');
                $this.addClass('active');
                dropdown.element.find('.selected-item').data(data).html(dropdown.renderSelectedText(data));
                if (dropdown.name) {
                    dropdown.element.find('[name="' + dropdown.name + '"]').val(data.id);
                }
            }
        } else {
            dropdown.element.find('.active').removeClass('active');
            dropdown.element.find('.selected-item').data('id', '').html(dropdown.defaultText);
        }
    };

    var Dropdown = require('../../ui').create({
        init: function () {
            this.element.addClass('dropdown-widget');
            this.value = this.value || this.element.data('id');
            this.render(this.data, this.value);
        },
        bindEvent: function () {
            var me = this;
            this.element.on('click', '.dropdown-item', function () {
                var $this = $(this);
                selectedItem($this, me);
                me.fire('change', $this.data());
            })

            .on('click', function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            })

            .on('input', '.search-container > :text', function (e) {
                var val = $.trim(this.value);
                me.filterItems(val, $(this));
            });
        },
        filterItems: function (val, item) {
            item.parent().nextAll().each(function () {
                var data = $(this).data('text') + '';
                if (data.indexOf(val) > -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        },
        render: function (data, val) {
            val = val || this.value;
            if (data) {
                this.formatData(data);
            }
            var html = Simplite.render('dropdown-template', $.extend(this, {
                list: data || [],
                value: val
            }));
            this.element.html(html);
            if (val != null) {
                this.setVal(val);
            }
        },
        setData: function (data) {
            var me = this;
            if (data) {
                me.formatData(data);
            }
            var itemsHtml = Simplite.render('dropdown-template-item', $.extend(this, data || []));
            this.element.find('.dropdown-menu').html(itemsHtml);

            if (this.value) {
                this.setVal(this.value);
            }
        },
        setVal: function (id) {
            selectedItem(this.element.find('.dropdown-item[data-id="' + id + '"]'), this);
        },
        getVal: function () {
            return this.getItem().id;
        },
        getItem: function () {
            return this.element.find('.selected-item').data();
        },
        renderSelectedText: function (item) {
            return item.text;
        },
        setDisabled: function (status) {
            if (status !== false) {
                this.element.addClass('disabled');
            } else {
                this.element.removeClass('disabled');
            }
        },
        formatData: function (data) {
            return data;
        }
    });

    Dropdown.defaultOptions = {
        defaultText: '请选择'
    };

    return Dropdown;
});