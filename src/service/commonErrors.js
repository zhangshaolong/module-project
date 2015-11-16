/**
 * @file 项目内统一处理的错误类型
 * @author zhangshaolong
 */
define(function (require, exports) {

    'use strict';

    exports['100001'] = '数据库连接错误';
    exports['100002'] = '数据库查询错误';
    exports['100003'] = '请求参数错误';

    var errorHandler = function (code) {
        
    };
});