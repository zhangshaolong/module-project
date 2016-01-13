var connect = require('gulp-connect');
// 为了同时和多个rd进行联调，支持多个端口访问
// 支持设置p参数，比如：gulp -p 8081
var argv = require('yargs').argv;
var router = require('./router');
var mock = require('./mock');
var less = require('./less');
module.exports = function () {
    var port = argv.p || 8080;
    var host = argv.h || 'localhost';
    return connect.server({
        host: host,
        port: port,
        root: process.cwd(),
        middleware: function(connect, opt) {
            return [
                router,
                mock,
                less
            ];
        }
    });
};