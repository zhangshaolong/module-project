var connect = require('gulp-connect');
var config = require('./config');
var router = require('./router');
// var prefix = require('./prefix'); // 为了配合在nginx层面转了多次之后才到达前端系统的情况。
var mock = require('./mock');
var less = require('./less');
module.exports = function () {
    var port = config.server.port;
    var host = config.server.host;
    return connect.server({
        host: host,
        port: port,
        root: process.cwd(),
        middleware: function(connect, opt) {
            return [
                // prefix,
                router,
                mock,
                less
            ];
        }
    });
};