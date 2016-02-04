/**
 * 子模块入口js，可以多层嵌套
 */

define(function (require, exports) {
    'use strict';

    // 事件管理器，页面内共享
    var eventEmitter = require('common/eventEmitter');

    // 你可以通过init的参数获取在data-interceptor-path设置的js的返回值
    exports.init = function () {

        var moduleNode = this.element;

        var moduleData = this.data;

        moduleNode.html(Simplite.render('task-list-sub-module-2', '哈哈测试传递的参数'));

        moduleNode.on('click', 'div', function () {
            eventEmitter.fire('sub2-clicked', {
                id: 23
            });
        });

        var pager = new Pager({
            element: '#pager-container'
        });
        pager.on(function (page) {
            console.log(page);
        });

        pager.render({
            currentPage: 4,
            totalPage: 20
        });
    };

    exports.dispose = function () {
        console.log('dispose task-list/sub-module-2');
    };
});