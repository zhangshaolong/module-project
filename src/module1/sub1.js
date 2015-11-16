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

        // 模拟一个异步处理，由于异步后模块处理器并不能扫描到此节点下面的所有data-module-path，所以可以手动调用模块扫描方法，如下：
        // setTimeout(function () {
        //     moduleNode.html(Simplite.render('module1-index-sub', {
        //         name: moduleData.userName,
        //         list: [
        //             {
        //                 date: '2015-10-10',
        //                 natureFlow: 100,
        //                 scoreCost: 222,
        //                 tgFlow: 30
        //             },
        //             {
        //                 date: '2015-10-11',
        //                 natureFlow: 381,
        //                 scoreCost: 334,
        //                 tgFlow: 41
        //             },
        //             {
        //                 date: '2015-10-12',
        //                 natureFlow: 230,
        //                 scoreCost: 456,
        //                 tgFlow: 23
        //             }
        //         ]
        //     }));

        //     require('common/moduleHanlder').init(moduleNode.children());
        // }, 1000);



        // 也可以返回一个Deferred来告诉模块管理器何时初始化下面的模块
        var deferred = $.Deferred();

        setTimeout(function () {
            moduleNode.html(Simplite.render('module1-index-sub', {
                name: moduleData.userName,
                list: [
                    {
                        date: '2015-10-10',
                        natureFlow: 100,
                        scoreCost: 222,
                        tgFlow: 30
                    },
                    {
                        date: '2015-10-11',
                        natureFlow: 381,
                        scoreCost: 334,
                        tgFlow: 41
                    },
                    {
                        date: '2015-10-12',
                        natureFlow: 230,
                        scoreCost: 456,
                        tgFlow: 23
                    }
                ]
            }));
            deferred.resolve();
        }, 1000);

        return deferred.promise();

    };
});