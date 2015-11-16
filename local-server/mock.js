/**
 * @file 本地开发时的mock请求拦截处理
 * @author zhangshaolong
 */

'use strict';

var queryString = require('querystring');

var URL = require('url');
var pathNormalize = require('path').normalize;

var formDataReg = /multipart\/form-data/;

module.exports = function (req, res, next) {
    if (req.url.indexOf('.ajax') > 0) {
        var doMock = function (params, pathName) {
            res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
            try {
                var path = require.resolve(pathNormalize('../mock/' + pathName.replace(/\.ajax$/, '')));
                delete require.cache[path];
                var result = require(path);
                if (typeof result === 'function') {
                    result = result(params);
                }
                if (!isNaN(result.sleep) && result.sleep > 0) {
                    setTimeout(function () {
                        //delete result.sleep;
                        res.end(JSON.stringify(result));
                    }, result.sleep);
                } else {
                    res.end(JSON.stringify(result));
                }
            } catch (e) {
                console.log(e);
                res.end(JSON.stringify({
                    status: 500
                }));
            }
        };
        var method = req.method.toUpperCase();
        var urlInfo = URL.parse(req.url, true);
        var contentType = req.headers['content-type'];
        if (formDataReg.test(contentType)) {
            req.once('data', function(data) {
                doMock(queryString.parse(String(data, 'UTF-8')), urlInfo.pathname);
            });
            return;
        }
        var params = '';
        if (method === 'POST') {
            req.on('data', function (data) {
                params += data;
            });
            req.on('end', function () {
                doMock(queryString.parse(params), urlInfo.pathname);
            });
        } else if (method === 'GET') {
            params = urlInfo.query;
            doMock(params, urlInfo.pathname);
        }
    } else {
        return next();
    }
}