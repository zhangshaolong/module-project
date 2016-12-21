define(function (require) {

    require('css!./table-sort.less');
    var TableSort = require('../../ui').create({
        init: function () {
            this.element.addClass('table-sort-widget');
            this.sortType = this.sortType || {};
            this.element.find('[sort-column]').each(function (i, sortNode) {
                var $sortNode = $(sortNode);
                $sortNode.append('<span class="glyphicon glyphicon-triangle-top"></span><span class="glyphicon glyphicon-triangle-bottom"></span>');
                $sortNode.parent('tr').children().each(function (idx, item) {
                    if (sortNode === item) {
                        $sortNode.data('idx', idx);
                    }
                })
            });
        },
        bindEvent: function () {
            var me = this;
            this.element.find('[sort-column] > .glyphicon-triangle-top, [sort-column] > .glyphicon-triangle-bottom').on('click', function () {
                var $this = $(this).parent();
                var column = $this.attr('sort-column');
                var order = $this.hasClass('sort-desc') ? 'asc' : 'desc';
                var sortData = {
                    column: column,
                    order: order
                };
                me.sort(sortData);
                me.fire('change', sortData);
            });
        },
        sort: function (sortData) {
            var me = this;
            this.element.find('[sort-column]').each(function () {
                var $sortNode = $(this);
                var column = $sortNode.attr('sort-column');
                var sortColumn = sortData.column;
                $sortNode.removeClass('sort-desc sort-asc');
                if (column === sortColumn) {
                    var sortType = $sortNode.attr('sort-type') || 'number';
                    $sortNode.addClass('sort-' + sortData.order);
                    var flag = sortData.order == 'desc' ? -1 : 1;
                    if (!me.serverSort) {
                        var idx = $sortNode.data('idx');
                        var invalidTrs = [];
                        var trs = me.element.find('tbody tr').sort(function (tr1, tr2) {
                            var v1 = $(tr1).find('td').eq(idx).text();
                            var v2 = $(tr2).find('td').eq(idx).text();
                            if (me.sortType[sortType]) {
                                return me.sortType[sortType](v1, v2);
                            }
                            switch (sortType) {
                                case 'number':
                                    var v1 = parseFloat(v1.replace(/\,/g, ''));
                                    var v2 = parseFloat(v2.replace(/\,/g, ''));
                                    if (isNaN(v1)) {
                                        invalidTrs.push(tr1);
                                        v1 = -Infinity;
                                    }
                                    if (isNaN(v2)) {
                                        invalidTrs.push(tr2);
                                        v2 = -Infinity;
                                    }
                                    var diff = v1 - v2;
                                    if (isNaN(diff)) {
                                        diff = 0;
                                    }
                                    return flag * diff;
                                case 'string':
                                    return flag * (v1 > v2 ? 1 : v1 < v2 ? -1 : 0);
                                case 'character': // 汉字比较
                                    return flag * v1.localeCompare(v2);
                                case 'datestring': // 日期字符串比较
                                    return flag * (Date.parse(v1) - Date.parse(v2));
                            }
                        });
                        $.each(trs, function () {
                            me.element.find('tbody').append(this);
                        });
                        $.each(invalidTrs, function () {
                            me.element.find('tbody').append(this);
                        });
                    }
                }
            });
        },
        getSort: function () {
            var descNode = this.element.find('.sort-desc');
            if (descNode[0]) {
                return {
                    column: descNode.attr('sort-column'),
                    order: 'desc'
                }
            }
            var ascNode = this.element.find('.sort-asc');
            if (ascNode[0]) {
                return {
                    column: ascNode.attr('sort-column'),
                    order: 'asc'
                }
            }
        }
    });

    return TableSort;
});