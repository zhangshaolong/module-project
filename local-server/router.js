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

var redirectHtml = function (urlPath, res) {
    for (var i = 0, len = routerConfig.length; i < len; i++) {
        var config = routerConfig[i];
        var key = config[0];
        var handler = config[1];
        if (typeof key === 'string') {
            if (urlPath === key) {
                var name = handler(key);
            }
        } else {
            if (key.test(urlPath)) {
                var name = urlPath.replace(key, handler);
            }
        }
        if (name) {
            var encoding = 'UTF-8';
            res.writeHead(200, {'Content-Type': 'text/html;charset=' + encoding});
            var fullPath = path.resolve('view/' + name);
            fs.exists(fullPath, function (exist) {
                if (exist) {
                    try {
                        var tplContent = fs.readFileSync(fullPath);
                        var content = new String(tplContent, encoding);
                    } catch (e) {
                        var content = JSON.stringify(e);
                    }
                    res.end(htmlMerge(content, encoding));
                } else {
                    res.end(fullPath + '文件不存在~');
                }
            });
            return;
        }
    }
    return false;
}

module.exports = function (req, res, next) {
    var pathname = URL.parse(req.url).pathname;
    var matched = redirectHtml(pathname, res);
    if (matched === false) {
        return next();
    }
};