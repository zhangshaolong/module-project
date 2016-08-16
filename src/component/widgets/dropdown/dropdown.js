define(function (require) {

    require('css!./dropdown.less');
    require('tpl!./dropdown.tpl');

    var selectedItem = function ($this, dropdown) {
        var oldItemNode = $this.siblings('.active');
        if (oldItemNode[0] !== $this[0]) {
            var data = $this.data();
            oldItemNode.removeClass('active');
            $this.addClass('active');
            dropdown.element.find('.selected-item').data('val', data.id).html(data.text);
            if (dropdown.name) {
                dropdown.element.find('[name="' + dropdown.name + '"]').val(data.id);
            }
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
            });
        },
        render: function (data, val) {
            val = val || this.value;
            var html = Simplite.render('dropdown-template', {
                list: data || [],
                defaultText: this.defaultText,
                value: val,
                dropup: this.dropup,
                name: this.name
            });
            this.element.html(html);
            if (val != null) {
                this.setVal(val);
            }
        },
        setData: function (data) {
            var me = this;
            var itemsHtml = Simplite.render('dropdown-template-item', data || []);
            this.element.find('.dropdown-menu').html(itemsHtml);

            if (this.value) {
                this.setVal(this.value);
            }
        },
        setVal: function (id) {
            selectedItem(this.element.find('.dropdown-item[data-id="' + id + '"]'), this);
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

    Dropdown.defaultOptions = {
        defaultText: '请选择'
    };

    return Dropdown;
});