define(function (require, exports) {
    'use strict';

    var service = require('service/web-pagelist');

    var eventEmitter = require('dep/eventEmitter');

    var Pager = require('component/widgets/pager/pager');

    var Dialog = require('component/widgets/dialog/dialog');

    var params = {
        current_page: 0,
        page_size: 10
    };

    var refreshList = function (moduleNode, pager, args) {
        $.extend(true, params, args);
        if (!args.product) return;
        service.getPageList(params).done(function (resp) {
            var html = Simplite.render('web-pagelist-list-tbody', resp.data);
            moduleNode.find('tbody').html(html);
            var totalCount = resp.data.total;
            var pageSize = params.page_size;
            var totalPage = parseInt((totalCount - 1) / pageSize) + 1;
            pager.render({
                currentPage: params.current_page + 1,
                totalPage: totalPage
            });
        });
    };

    exports.init = function () {

        var moduleNode = this.element;

        var html = Simplite.render('web-pagelist-list');

        moduleNode.html(html);

        var pager = Pager.init({
            element: moduleNode.find('.widgets-pager')
        });

        var dialog = Dialog.init({
            data: {
                title: '弹窗标题',
                content: '弹窗内容'
            }
        });

        dialog.on('ok', function () {
            dialog.hide();
        });

        moduleNode.on('click', '.trend', function (e) {
            e.stopPropagation();
            var href = $(this).data('href');
            var url = $(this).data('url');
            var startDate = params.start_date;
            var endDate = params.end_date;
            window.open(href + '?start_date=' + startDate + '&end_date=' + endDate + '&url=' + encodeURIComponent(url));
        });

        pager.on('page', function (data) {
            params.current_page = data.currentPage - 1;
            refreshList(moduleNode, pager);
        });

        eventEmitter.on('web-pagelist-filters-change', function (args) {
            refreshList(moduleNode, pager, args);
        });

        eventEmitter.on('web-pagelist-filters-dialog', function () {
            dialog.show();

            setTimeout(function () {
                dialog.setTitle('标题可以动态设置');
                dialog.setContent('内容可以动态设置');
            }, 1000);
        });
    };
});