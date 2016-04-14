define(function (require, exports) {

    require('./base-nav');

    // store里面的数据是页面内共享的
    var store = require('common/store');

    var userService = require('service/common/user-service');

    exports.init = function () {

        var moduleNode = this.element;

        return userService.getUserData(Math.round(Math.random() * 100)).done(function (resp) {

            if (resp.status === 200) {

                store.set('userData', resp.data);

                moduleNode.find('.user-name').text(resp.data.name);
            }
        });
    };

    // 启动模块初始化
    require('dep/moduleHandler').init();

});