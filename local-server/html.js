/**
 * @file 本地开发时的html请求拦截处理
 * @author zengcheng zhangshaolong
 */

var Simplite = require('../dep/simplite');
var gulp = require('gulp');
var through = require('through2');
var fs = require('fs');
var path = require('path');
var URL = require('url');

var includeReg = /\<\%\s*include\s*\(\s*(['"])(.*?)\1/g;

var parseInclude = function (content, encoding) {
    content.replace(includeReg, function (all, quot, pth) {
        var tplContent = fs.readFileSync(path.resolve('view/' + pth));
        Simplite.addTemplate(pth, new String(tplContent, encoding));
    });
};

var htmlMerge = exports.htmlMerge = function (htmlContent, encoding) {
    var key = (new Date().getTime()) + '_t';
    parseInclude(htmlContent, encoding || 'UTF-8');
    Simplite.addTemplate(key, htmlContent);
    Simplite.compiles = {};
    content = Simplite.render(key);
    return content;
};

var htmlWriter = exports.htmlWriter = function (res) {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        content = htmlMerge(content, encoding);
        file.contents = new Buffer(content);
        this.push(file);
        res && res.end(content);
        return callback();
    });
};

exports.htmlProxy = function (req, res, next) {
    var url = req.url;
    url = URL.parse(url).pathname;

    if (url.indexOf('.html') > 0) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        return gulp.src(url.substr(1))
            .pipe(htmlWriter(res));
    } else {
        return next();
    }
};