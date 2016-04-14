define(function (require, exports) {

    require('./base-nav');

    var service = require('./service/common');

    exports.init = function () {
        var moduleNode = this.element;
        return service.getUserInfo().done(function (resp) {
            moduleNode.find('.user-name').text(resp.data.name);
        });
    };

    // 启动模块初始化
    require('dep/moduleHandler').init();

});