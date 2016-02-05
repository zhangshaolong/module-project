var connect = require('gulp-connect');
var config = require('./config');
var router = require('./router');
var mock = require('./mock');
var less = require('./less');
var prefix = require('./prefix');
var buildPath = require('../gulp-builder/config').buildPath;
module.exports = function () {
    var port = config.server.port;
    var host = config.server.host;
    var cwd = config.cwd;
    return connect.server({
        host: host,
        port: port,
        root: [cwd, cwd + '/' + buildPath],
        middleware: function(connect, opt) {
            return [
                prefix,
                router,
                mock,
                less
            ];
        }
    });
};