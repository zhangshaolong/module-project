/**
 * @file 本地开发时请求less时编译
 * @author zhangshaolong
 */

'use strict';
var gulp = require('gulp');
var less = require('gulp-less');
var through = require('through2');
var lessPluginFunction = require('less-plugin-functions');

var cssWriter = function (res) {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        res.end(content);
        return callback();
    });
};

module.exports = function (req, res, next) {
    var url = req.url;
    if (url.indexOf('.less') > 0) {
        res.writeHead(200, {'Content-Type': 'text/css'});
        return gulp.src(url.substr(1))
            .pipe(less({ plugins: [new lessPluginFunction()] }))
            .pipe(cssWriter(res));
    } else {
        return next();
    }
};