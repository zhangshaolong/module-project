define(function () {

    var Pager = function (options) {
        $.extend(this, options, Pager.defaultConfig);
        this.element = $(this.element);
        this.init();
    };

    Pager.defaultConfig = {
        pageBtn: '.page-btn',
        current: '.active',
        preGroup: '.pre-group',
        nextGroup: '.next-group',
        currentPage: 1,
        pageSize: 20,
        totalPage: 1,
        displayPageCount: 5,
        currentGroup: 1,
        totalGrout: 1,
        listeners: []
    };

    Pager.prototype.init = function () {
        this.initStructure();
        this.bindEvent();
    };

    Pager.prototype.render = function (data) {
        $.extend(this, data);
        this.totalGrout = parseInt((this.totalPage -1) / this.displayPageCount) + 1;
        var pageHtml = Simplite.render('pager-template', {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            totalPage: this.totalPage,
            displayPageCount: this.displayPageCount,
            currentGroup: this.currentGroup,
            totalGrout: this.totalGrout
        });
        this.element.html(pageHtml);
    };

    Pager.prototype.initStructure = function () {
        // Simplite.addTemplate('pager-template', $('#pager-template').html());
    };

    Pager.prototype.bindEvent = function () {
        var me = this;
        this.element.on('click', this.preGroup, function () {
            me.toPreGroup($(this));
        })

        .on('click', this.nextGroup, function () {
            me.toNextGroup($(this));
        })

        .on('click', this.pageBtn, function () {
            me.page($(this).data('page'));
        })
    };

    Pager.prototype.toPreGroup = function (element) {
        if (element.hasClass('disabled')) {
            return;
        }
        this.currentGroup--;
        this.render();
    };

    Pager.prototype.toNextGroup = function (element) {
        if (element.hasClass('disabled')) {
            return;
        }
        this.currentGroup++;
        this.render();
    };

    Pager.prototype.page = function (page) {
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
        this.element.find('[data-page]').each(function () {
            if ($(this).data('page') == page) {
                $(this).removeClass('page-btn').addClass('active');
            } else {
                $(this).addClass('page-btn').removeClass('active');
            }
        });

        this.trigger();
    };

    Pager.prototype.on = function (listener) {
        if ($.isFunction(listener)) {
            this.listeners.push(listener);
        }
    };

    Pager.prototype.trigger = function () {
        var data = {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            totalPage: this.totalPage,
            displayPageCount: this.displayPageCount
        };
        $.each(this.listeners, function (idx, listener) {
            listener(data);
        });
    };

    return Pager;
});