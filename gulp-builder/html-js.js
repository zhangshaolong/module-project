var through = require('through2');
var rjs = require('requirejs');
var tplToJs = require('./tpl-compile');
var config = require('./config');
var commentTrimReg = /(?:(["'])[\s\S]*?\1)|(?:\/\/.*\n)|(?:\/\*([\s\S])*?\*\/)/g;
var commentTrimHandler = function (all) {
    var start = all.charAt(0);
    switch (start) {
        case '/' :
            return '';
        case '"' :
        case "'" :
            return all;
    }
};
module.exports = function () {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        content.replace(config.mainJsRule, function (all, path) {
            rjs.optimize({
                baseUrl: 'src',
                name: path,
                paths: {
                    tpl: 'common/tpl'
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
                    return contents.replace(commentTrimReg, commentTrimHandler);
                },
                out: config.buildPath + '/' + config.jsPath + '/' + path + '.js'
            });
            content = content.replace(/baseUrl\s*:\s*["']\/src["'],/, 'baseUrl: \'\/' + config.jsPath + '\',');

            file.contents = new Buffer(content);
            return all;
        });
        this.push(file);
        return callback();
    });
};