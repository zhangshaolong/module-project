/**
 * @file 图片惰性加载控制器
 * @author 张少龙
 */
define(function (require) {

    'use strict';

    var bindScroll = require('common/bindScroll');
    var viewportHeight = null;

    var $window = $(window);

    var $body = $('body');

    var delay = 0;

    var imgs = null;

    function setLoading($img) {

        if (!$img.prop('loading')) {
            $img.prop('loading', true).addClass('img-loading');
        }
    }

    function getNearestHeight($node) {

        var height = $node.height();
        while(!height) {
            $node = $node.parent();
            height = $node.height();
        }
        return height;
    }

    var exports = {

        init: function () {

            bindScroll($window, exports.scanning, delay);

            exports.scanning(true);

            setTimeout(function () {
                $window.scroll();
            }, 0);
        },

        scanning: function(refindImgs, container) {

            var viewHeight = viewportHeight();

            var viewHeightMin = $window.scrollTop();
            var viewHeightMax = viewHeightMin + viewHeight;

            if (refindImgs) {
                imgs = (container ? $(container) : $body).find('img[data-src]');
            }

            imgs.each(function () {

                var $img = $(this);
                var offsetTop = $img.offset().top;
                var height = getNearestHeight($img);

                if ((viewHeightMax >= offsetTop - height - viewHeight) && (viewHeightMin <= offsetTop + height + viewHeight)) {
                    if (!$img.prop('loaded')) {

                        $img.prop('src', $img.data('src')).prop('loaded', true).removeAttr('data-src').removeClass('img-loading');
                    }
                } else {
                    setLoading($img);
                }
            });
        }
    }

    return exports;
});