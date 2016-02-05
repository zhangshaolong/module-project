define(function (require, exports) {

    require('tpl!../../tpl/product-list.tpl');
    require('./product-list');

    var Pager = require('component/pager/pager');

    exports.init = function () {

        var pager = new Pager({
            element: this.element.find('.pager-container')
        });
        pager.on(function (data) {
            console.log(data);
        });
        pager.render({
            totalPage: 134
        });
    };
});