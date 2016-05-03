define(function (require, exports) {
    'use strict';

    var service = require('service/web-pagelist');

    require('tpl!/tpl/web-pagelist.tpl');

    require('./filters');

    require('./list');

    exports.init = function () {

        var moduleNode = this.element;

        var pageHtml = Simplite.render('web-pagelist');

        moduleNode.html(pageHtml);
    };
});