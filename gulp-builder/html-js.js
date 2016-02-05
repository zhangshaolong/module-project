var through = require('through2');
var rjs = require('requirejs');
var path = require('path');
var tplToJs = require('./tpl-compile');
var config = require('./config');
module.exports = function () {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        content.replace(config.mainJsRule, function (all, main) {
            rjs.optimize({
                baseUrl: 'src',
                name: main,
                paths: {
                    tpl: 'common/tpl',
                    dep: '../dep'
                },
                stubModules: ['tpl'],
                optimizeAllPluginResources: false,
                onBuildRead: function (moduleName, pth, contents) {
                    return tplToJs(contents, pth);
                },
                onBuildWrite: function (moduleName, pth, contents) {
                    if (moduleName === 'tpl') {
                        return '';
                    }
                    return contents;
                },
                out: path.join(config.buildPath, config.jsPath, main + '.js')
            });
            content = content.replace(config.baseUrlReg, '$1' + config.jsPath + '$2');

            file.contents = new Buffer(content);
            return all;
        });
        this.push(file);
        return callback();
    });
};