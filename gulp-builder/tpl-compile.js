var fs = require('fs');
var path = require('path');
var Simplite = require('../dep/simplite');
var config = require('./config');
var tplReg = config.tplReg;
var tplRule = config.tplRule;
var cwd = config.cwd;

module.exports = function (content, pth) {
    var compileds = '';
    content = content.replace(tplRule, function (all, tplPath) {
        if (tplPath.indexOf('.') === 0) { // 不会存在代码写在隐藏文件里面的情况
            tplPath = path.join(path.dirname(pth), tplPath);
        } else {
            tplPath = path.join(cwd, tplPath);
        }
        var data = fs.readFileSync(tplPath, 'utf-8');
        data.replace(tplReg, function (all, tplId, tplContent) {
            compileds += 'Simplite.compiles["' + tplId + '"]=function (data) {return (function(' + Simplite.dataKey + '){'
                + Simplite.toCodeBlock(tplContent)
                + '}).call(Simplite, data);},';
        })
        return '';
    });
    return ';' + compileds + content;
};