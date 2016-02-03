/**
 * @file 前缀路径转换处理，目前主要支持上线项目的时候，不是作为顶层项目的情况，资源引用的相对路径需要做调整
 * @author zhangshaolong
 */

'use strict';
var URL = require('url');
var argv = require('yargs').argv;
var request = require('./request');
var config = require('./config');
var prefixConfig = require('./prefixConfig');

var isProxyReq = function (urlInfo) {
    var query = urlInfo.query;
    return query && query.proxy;
};

module.exports = function (req, res, next) {
    var reqUrl = req.url;
    var urlInfo = URL.parse(reqUrl);
    var pathname = urlInfo.pathname;
    var matchedKey;
    for (var key in prefixConfig) {
        if (pathname.indexOf(key) === 0) {
            matchedKey = key;
        }
    }
    if (matchedKey) {
        var apiType = config.api.type;
        var apiValue = config.api.value;
        var isApi = false;
        if (apiType === 'prefix') {
            isApi = pathname.indexOf(config.rootBase + apiValue) === 0;
        } else if (apiType === 'suffix') {
            isApi = reqUrl.split('?')[0].endsWith(apiValue);
        }
        var prefixKey = matchedKey;
        if (isApi) {
            return next();
            // if (isProxyReq(URL.parse(req.headers.referer, true))) {
            //     return next();
            // } else {
            //     return next();
            // }
        }
        var proxyReq = request({
            host: urlInfo.host || config.server.host,
            port: urlInfo.port || config.server.port,
            path: pathname.replace(prefixKey, prefixConfig[matchedKey]),
            method: req.method,
            headers: req.headers
        }, function(proxyRes) {
            proxyRes.pipe(res);
        });
        req.on('data', function (data) {
            proxyReq.write(data);
        });

        req.on('end', function () {
            proxyReq.end();
        });

    } else {
        return next();
    }
};