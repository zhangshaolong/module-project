define(function (require, exports) {

    var pathMap = {
        '/product/list': ['/product/list', '/product/add', '/']
    };

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
                        return false;
                    }
                });
            } else {
                if (href === pathname) {
                    $this.parent().addClass('active');
                }
            }
            $this.attr('href', href).removeAttr('data-href');
        });
    };
});