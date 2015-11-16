/**
 * 具体模块的入口js，推荐每个页面的body对应一个module，具体请参照对应模块的html的data-module-path属性
 * module元素上还可以设置data-interceptor-path属性，为初始化具体模块之前做一些业务处理
 */

define(function (require, exports) {
    'use strict';

    var indexService = require('service/module1/indexService');

    require('tpl!/tpl/module1/index.tpl');

    exports.init = function (id) {

        // 模块元素，查找元素都要基于此元素，目的是防止干扰其他模块
        var moduleNode = this.element;

        // 不同的模块间事件通讯
        var eventEmitter = this.eventEmitter;

        var module1Data = this.data;

        moduleNode.on('click', '.main', function () {
            alert('module main clicked');
        });

        eventEmitter.on('sub2-clicked', function (data) {
            alert(data.id);
        });

        // 可以返回一个Deferred来延迟初始化此模块下面的所有模块
        return indexService.getSomeData({
            id: id
        }).done(function (response) {
            moduleNode.find('div').attr('data-user-name', response.data.name);
        });
    };
});