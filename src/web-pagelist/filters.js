define(function (require, exports) {
    'use strict';

    var service = require('service/web-pagelist');

    var eventEmitter = require('dep/eventEmitter');

    var Dropdown = require('component/widgets/dropdown/dropdown');

    var startDate = moment().add(-14, 'days').startOf('day');
    var endDate = moment().add(-1, 'days').startOf('day');

    exports.init = function () {

        var argsMap = {
            product: '',
            start_date: startDate.format('YYYY-MM-DD'),
            end_date: endDate.format('YYYY-MM-DD')
        };

        var moduleNode = this.element;

        

        service.getProducts().done(function (resp) {

            var html = Simplite.render('web-pagelist-filters', $.extend(true, {}, argsMap, resp.data));
            moduleNode.html(html);

            var dropdown = Dropdown.init({
                element: moduleNode.find('.dropdown'),
                defaultText: '请选择产品'
            });

            dropdown.on('change', function (item) {
                argsMap.product = item.id;
                eventEmitter.fire('web-pagelist-filters-change', argsMap);
            });

            var list = resp.data.list;
            var dropdownData = [];
            $.each(list, function (idx, item) {
                dropdownData.push({
                    id: item,
                    text: item
                });
            });
            dropdown.render(dropdownData);

            moduleNode.find('#date-range').daterangepicker({
                startDate: startDate,
                endDate: endDate,
                timePicker: false,
                timePicker12Hour: false,
                linkedCalendars:true,
                separator: ' 到 ',
                format: 'YYYY-MM-DD',
                opens: 'right',
                ranges: {
                '近1天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '近15天': [moment().subtract(15, 'days'), moment().subtract(1, 'days')],
                '近30天': [moment().subtract(30, 'days'), moment().subtract(1, 'days')]
                },
                locale: {
                  applyLabel: '确定',
                  cancelLabel: '取消',
                  fromLabel: '开始时间',
                  toLabel: '结束时间',
                  customRangeLabel: '自定义',
                  daysOfWeek: ['日','一','二','三','四','五','六'],
                  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
                }
            }, 
            function(start, end, label) {
                var beginTime = start.format('YYYY-MM-DD');
                var endTime = end.format('YYYY-MM-DD');
                argsMap.start_date = beginTime;
                argsMap.end_date = endTime;
                eventEmitter.fire('web-pagelist-filters-change', argsMap);
            });
        });

        moduleNode.on('click', '.dialog', function () {
            eventEmitter.fire('web-pagelist-filters-dialog');
        });

        eventEmitter.fire('web-pagelist-filters-change', argsMap);
    };
});