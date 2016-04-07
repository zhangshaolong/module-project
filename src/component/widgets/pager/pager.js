define(function (require) {

    require('css!./pager.less');
    require('tpl!./pager.tpl');

    Simplite.addFilter('format-length', function (num, maxNum) {
        for (var i = ('' + num).length, len = ('' + maxNum).length; i < len; i++) {
            num = '0' + num;
        }
        return num;
    });

    var Pager = require('../../ui').create({
        init: function (options) {
            this.element = $(this.element);
        },
        bindEvent: function () {
            var me = this;
            this.element.on('click', this.actions.preGroup, function () {
                me.toPreGroup($(this));
            })

            .on('click', this.actions.nextGroup, function () {
                me.toNextGroup($(this));
            })

            .on('click', this.actions.pageBtn, function () {
                me.toPage($(this).data('page'));
            })
        },
        render: function (data) {
            $.extend(this, data);
            this.totalGroup = parseInt((this.totalPage - 1) / this.displayPageCount) + 1;
            var pageHtml = Simplite.render('pager-template', {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                totalPage: this.totalPage,
                displayPageCount: this.displayPageCount,
                currentGroup: this.currentGroup,
                totalGroup: this.totalGroup
            });
            this.element.html(pageHtml);
        },
        toPreGroup: function (element) {
            if (element.hasClass('disabled')) {
                return;
            }
            this.currentGroup--;
            this.render();
        },
        toNextGroup: function (element) {
            if (element.hasClass('disabled')) {
                return;
            }
            this.currentGroup++;
            this.render();
        },
        toPage: function (page) {
            page = parseInt(page);
            if (isNaN(page)) {
                return;
            }
            if (page < 0) {
                page = 0;
            }
            if (page > this.totalPage) {
                page = this.totalPage;
            }
            this.currentPage = page;
            this.currentGroup = parseInt((this.currentPage - 1) / this.displayPageCount) + 1;
            this.render();

            this.fire('page', {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                currentGroup: this.currentGroup,
                totalPage: this.totalPage,
                displayPageCount: this.displayPageCount
            });
        }
    });

    Pager.defaultOptions = {
        actions: {
            pageBtn: '.page-btn',
            preGroup: '.pre-group',
            nextGroup: '.next-group'
        },
        currentPage: 1,
        pageSize: 20,
        totalPage: 1,
        displayPageCount: 5,
        currentGroup: 1,
        totalGroup: 1
    };

    return Pager;
});