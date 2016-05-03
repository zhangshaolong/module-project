define(function (require, exports) {
    'use strict';

    var service = require('service/web-pagelist');

    var eventEmitter = require('common/eventEmitter');

    var store = require('common/store');

    var Pager = require('component/widgets/pager/pager');

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

        var args = store.get('web-pagelist-filters');
        if (args) {
            refreshList(moduleNode, pager, args);
        }
    };
});