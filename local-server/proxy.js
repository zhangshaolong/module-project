/**
 * @file 本地开发时的mock请求代理转发
 * @author zhangshaolong
 */

'use strict';

var http = require('http');

var URL = require('url');

var parseUrl = function (url) {
    var query = URL.parse(url, true).query;
    if (query && query.proxy) {
        var pair = query.proxy.split(':');
        return {
            host: pair[0],
            port: pair[1] || 80
        }
    }
};

module.exports = function (req, res, next) {

    if (req.url.indexOf('.ajax') > 0) {

        var pageUrl = req.headers.referer;

        var proxyInfo = parseUrl(pageUrl);

        var options = {
            host: proxyInfo.host,
            port: proxyInfo.port,
            path: req.url,
            method: req.method,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
            // headers: {
            //   // 如果代理服务器需要认证
            //   'Proxy-Authentication': 'Base ' + new Buffer('user:password').toString('base64')    // 替换为代理服务器用户名和密码
            // }       
        };

        var proxyReq = http.request(options, function(proxyRes) {
            res.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
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
}