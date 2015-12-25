/**
 * @file 本地开发时路由分配
 * @author zhangshaolong
 */

'use strict';
var gulp = require('gulp');
var through = require('through2');
var Simplite = require('../dep/Simplite');
var URL = require('url');
var fs = require('fs');
var path = require('path');
var htmlProcessor = require('./html');
var routerConfig = require('./routerConfig');

module.exports = function (req, res, next) {

    var pathname = URL.parse(req.url).pathname;
    var redictPath = routerConfig[pathname];
    if (redictPath) {
        var encoding = 'UTF-8';
        res.writeHead(200, {'Content-Type': 'text/html'});
        var tplContent = fs.readFileSync(path.resolve('view/' + redictPath));
        var content = new String(tplContent, encoding);
        res.end(htmlProcessor.htmlMerge(content, encoding));
    } else if (pathname.indexOf('.html') > 0) {
        htmlProcessor.htmlProxy(req, res, next);
    } else {
        return next();
    }
};