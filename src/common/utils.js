/**
 * @file 项目中用到的一些通用的方法集
 * @author zhangshaolong
 */

define(function (require, exports) {
    exports.deepCopy = function (source) {
        var deepSource;
        var constructor = source.constructor;
        (function recursive(source, result, idx) {
            var constructor = source && source.constructor,
                obj,
                key,
                i,
                len,
                isTop = result === undefined;
            if (constructor === Object) {
                obj = (isTop ? deepSource = {} : result[idx] = {});
                for (key in source) {
                    recursive(source[key], obj, key);
                }
            } else if (constructor === Array) {
                i = 0, len = source.length;
                obj = (isTop ? deepSource = [] : result[idx] = []);
                while (i < len) {
                    recursive(source[i], obj, i++);
                }
            } else if (constructor === Function) {
                try {
                    result[idx] = new Function('return ' + source.toString())();
                } catch (e) {
                    result[idx] = source;
                }
            } else if (typeof source === 'object') {
                result[idx] = new constructor(source);
            } else {
                result[idx] = source;
            }
        })(source);
        return deepSource;
    };


});