/**
 * @file 页面中各个模块及单个模块使用的数据载体
 * @author zhangshaolong
 */

define(function (require, exports) {

    'use strict';

    var utils = require('./utils');

    var datasource = {};

    var slice = Array.prototype.slice;

    exports.set = function (key, val) {
        if (typeof key === 'string') {
            datasource[key] = val;
        }
    };

    exports.get = function (key) {
        return arguments.length ? datasource[key] : datasource;
    };

    exports.dump = function (key) {
        var result = {};
        if (arguments.length) {
            if (key.constructor === Array) {
                for (var i = 0, len = key.length; i < len; i++) {
                    var k = key[i];
                    result[k] = utils.deepCopy(datasource[k]);
                }
            } else {
                result[key] = utils.deepCopy(datasource[key]);
            }
        } else {
            for (var k in datasource) {
                result[k] = utils.deepCopy(datasource[k]);
            }
        }
        return result;
    };
});
