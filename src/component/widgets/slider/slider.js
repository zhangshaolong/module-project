define(function (require) {
    require('css!./slider.less');
    require('tpl!./slider.tpl');

    var Slider = require('../../ui').create({
        init: function () {
            this.element.addClass('slider-widget');
            this.build();
        },
        bindEvent: function () {
            var me = this;
            this.element.on('click', this.actions.prev, function () {
                me.toPage(me.currentPage - 1);
            })

            .on('click', this.actions.next, function () {
                me.toPage(me.currentPage + 1);
            })

            .on('click', this.actions.page, function () {
                me.toPage($(this).data('page'));
            })

            // .on('mouseover', '.slider-container', function () {
            //     clearInterval(me.stepTimer);
            //     clearTimeout(me.changerTimer);
            // })
            // .on('mouseout', '.slider-container', function () {
            //     me.toPage(me.currentPage);
            // })
        },
        build: function () {
            var html = Simplite.render('slider-template', this);
            this.element.append(html);
            this.resourceHolder = this.find('.resource-holder');
        },
        render: function (data) {
            var me = this;
            data = $.extend(true, {
                list: data
            }, this);
            var html = Simplite.render('slider-template-resource', data);
            this.resources = this.resourceHolder.html(html).find('.slider-resource');
            html = Simplite.render('slider-template-page', data);
            this.pages = this.find('.pager-holder').html(html).find('.slider-page');
            this.resourceHolder.css('width', this.width * (this.pages.length + 1) + 'px');
            setTimeout(function () {
                me.toPage(1);
            }, this.switchInterval);
        },
        toPage: function (page) {
            var me = this;
            if (me.moving) {
                return;
            }
            clearInterval(me.stepTimer);
            clearTimeout(me.changerTimer);
            if (me.cloneNode) {
                me.cloneNode.remove();
            }
            var len = me.pages.length;
            if (!len) {
                return;
            }
            me.moving = true;
            var distance = 0;
            var realPage = (len + page) % len;
            var cloneNode = me.cloneNode = this.resources[realPage].cloneNode(true);
            $(me.pages[me.currentPage]).removeClass('selected');
            $(me.pages[realPage]).addClass('selected');
            if (page > me.currentPage) {
                distance = -me.width;
                $(this.resources[me.currentPage]).after(cloneNode);
            } else if (page < me.currentPage) {
                distance = me.width;
                $(this.resources[me.currentPage]).before(cloneNode);
            }
            if (distance) {
                var step = distance / me.speed * me.interval;
                var left = parseFloat(me.resourceHolder.css('left'));
                if (distance > 0) {
                    left = left - distance;
                    me.resourceHolder.css('left', left + 'px');
                }
                var offset = 0;
                me.stepTimer = setInterval(function () {
                    offset = offset + step;
                    if (offset * offset >= me.width * me.width) {
                        clearInterval(me.stepTimer);
                        cloneNode.remove();
                        me.moving = false;
                        me.resourceHolder.css('left', -realPage * me.width + 'px');
                        me.changerTimer = setTimeout(function () {
                            me.toPage(realPage + 1);
                        }, me.switchInterval);
                    } else {
                        me.resourceHolder.css('left', left + offset + 'px');
                    }
                }, me.interval);
            }
            // var left = parseFloat(me.resourceHolder.css('left'));
            // var distance = - page * me.width - left;
            // var flg = distance > 0 ? 1 : -1;
            // var step = distance / me.speed * me.interval;
            // var offset = left;
            // var len = me.pages.length;
            // me.stepTimer = setInterval(function () {
            //     offset = offset + step;
            //     if (flg * (offset - left - distance) >= 0) {
            //         clearInterval(me.stepTimer);
            //         me.resourceHolder.css('left', -page * me.width + 'px');
            //         me.changerTimer = setTimeout(function () {
            //             page++;
            //             if (page === len) {
            //                 page = 0;
            //             }
            //             me.toPage(page);
            //         }, me.switchInterval);
            //     } else {
            //         me.resourceHolder.css('left', offset + 'px');
            //     }
            // }, me.interval);
            me.currentPage = realPage;
        }
    });

    Slider.defaultOptions = {
        actions: {
            page: '.slider-page',
            prev: '.slider-prev',
            next: '.slider-next'
        },
        width: 400,
        height: 300,
        pages: [],
        interval: 5,
        speed: 500,
        switchInterval: 2000,
        currentPage: 0
    };

    return Slider;
})