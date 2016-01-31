var through = require('through2');
var rjs = require('requirejs');
var tplToJs = require('./tpl-compile');
var config = require('./config');
module.exports = function () {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        content.replace(config.mainJsRule, function (all, path) {
            rjs.optimize({
                baseUrl: 'src',
                name: path,
                paths: {
                    tpl: 'common/tpl',
                    dep: './../dep'
                },
                stubModules: ['tpl'],
                optimizeAllPluginResources: false,
                onBuildRead: function (moduleName, pth, contents) {
                    return tplToJs(contents);
                },
                onBuildWrite: function (moduleName, pth, contents) {
                    if (moduleName === 'tpl') {
                        return '';
                    }
                    return contents;
                },
                out: config.buildPath + '/' + config.jsPath + '/' + path + '.js'
            });
            content = content.replace(/baseUrl\s*:\s*["']([^\/]+)?\/src["'],/, 'baseUrl: \'$1\/' + config.jsPath + '\',');

            file.contents = new Buffer(content);
            return all;
        });
        this.push(file);
        return callback();
    });
};