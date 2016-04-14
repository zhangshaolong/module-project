define(function (require, exports) {

    var pathMap = {
    };

    var querys = require('common/utils').getQuery();

    exports.init = function () {

        var moduleNode = this.element;

        var pathname = location.pathname;

        var search = location.search;

        moduleNode.find('a').each(function () {
            var href = $(this).attr('data-href');
            var pathArr = pathMap[href];
            var $this = $(this);
            if (pathArr) {
                $.each(pathArr, function (idx, pname) {
                    if (pname === pathname) {
                        $this.parent().addClass('active');
                    }
                });
            } else {
                if (href.indexOf(pathname) === 0) {
                    $this.parent().addClass('active');
                }
            }
            var args = $(this).data('args');
            if (!args) {
                $this.attr('href', href).removeAttr('data-href');
            } else {
                args = args.split(',');
                var serachs = [];
                for (var i = 0, len = args.length; i < len; i++) {
                    serachs.push(args[i] + '=' + querys[args[i]]);
                }
                $this.attr('href', href + '?' + serachs.join('&')).removeAttr('data-href');
            }
        });
    };
});