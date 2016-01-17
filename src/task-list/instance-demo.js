/**
 * 子模块入口js，可以多层嵌套
 */

define(function (require, exports) {
    'use strict';

    var Module = function () {

    };

    Module.prototype.init = function () {

        var me = this;

        console.log(this.element);

        this.element.on('click', 'button', function () {
            me.dispose();
        });
    };

    Module.prototype.dispose = function () {
        console.log('销毁了instance-demo', this.data.type);
        this.element.remove();
    };

    return Module;
});