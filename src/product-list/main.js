define(function (require, exports) {

    require('tpl!../../tpl/product-list.tpl');
    require('./product-list');

    var Pager = require('component/widgets/pager/pager');

    exports.init = function () {

        var pager = new Pager({
            element: this.element.find('.pager-container')
        });
        pager.on('page', function (data) {
            console.log(data);
        });
        pager.render({
            totalPage: 134,
            displayPageCount: 10
        });
    };
});