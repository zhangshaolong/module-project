/**
 * 子模块入口js，可以多层嵌套
 */

define(function (require, exports) {
    'use strict';

    // 你可以通过init的参数获取在data-interceptor-path设置的js的返回值
    exports.init = function (id) {

        var moduleNode = this.element;

        var eventEmitter = this.eventEmitter;

        var moduleData = this.data;

        moduleNode.html(Simplite.render('module1-index-sub2', '哈哈测试传递的参数'));

        moduleNode.on('click', 'div', function () {
            eventEmitter.fire('sub2-clicked', {
                id: 23
            });
        });
    };
});