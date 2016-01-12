/**
 * @file 本地开发时路由分配
 * @author zhangshaolong
 */

'use strict';
var gulp = require('gulp');
var through = require('through2');
var URL = require('url');
var fs = require('fs');
var path = require('path');
var htmlMerge = require('./html').htmlMerge;
var routerConfig = require('./routerConfig');

/**
 * 支持多级定向查找，直到找到.html文件或者未找到为止
 */
var lookupRedirectHtml = function (urlPath, res) {
    var redirectPath = routerConfig[urlPath];
    if (redirectPath) {
        if (redirectPath.indexOf('.html') > 0) {
            var encoding = 'UTF-8';
            res.writeHead(200, {'Content-Type': 'text/html'});
            var tplContent = fs.readFileSync(path.resolve('view/' + redirectPath));
            var content = new String(tplContent, encoding);
            res.end(htmlMerge(content, encoding));
        } else {
            return lookupRedirectHtml(redirectPath, res);
        }
    } else {
        return false;
    }
}

module.exports = function (req, res, next) {
    var pathname = URL.parse(req.url).pathname;
    var matched = lookupRedirectHtml(pathname, res);
    if (matched === false) {
        return next();
    }
};