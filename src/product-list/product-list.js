define(function (require, exports) {

    var service = require('service/product-list');

    // store里面的数据是页面内共享的
    var store = require('common/store');

    Simplite.addFilter('formatJson', require('common/utils').formatJSON);

    exports.init = function () {

        var moduleNode = this.element;

        service.getProductList({
            holder: moduleNode
        }).done(function (resp) {
            if (resp.status === 200) {
                var data = resp.data;
                var html = Simplite.render('product-list-product-list', data);

                moduleNode.html(html);
            } else {
                console.log('获取业务线列表出错');
            }
        });

        moduleNode.on('click', '.delete-product', function () {
            service.deleteProduct({
                id: store.get('productId')
            }).done(function (resp) {
                if (resp.status === 200) {
                    window.location.reload(true);
                } else {
                    alert('删除产品线失败，请重试');
                }
            });

        })

        .on('click', '.to-set-delete', function () {
            store.set('productId', $(this).data('id'));
            moduleNode.find('.deleted-product-name').text($(this).data('name'));
        });
    };
});