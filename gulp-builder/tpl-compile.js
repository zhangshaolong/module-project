var fs = require('fs');
var Simplite = require('../dep/Simplite');
var tplReg = /\{\{\s*\-\-\s*tpl\s*\:\s*([^\}\s]+)\s*\-\-\s*\}\}\s*([\s\S]+?)\{\{\s*\-\-\s*\/tpl\s*\-\-\s*\}\}/g;
var tplRule = /require\(["']tpl!([^"']+)["']\);?/g;
module.exports = function (content) {
    var compileds = '';
    content = content.replace(tplRule, function (all, path) {
        var data = fs.readFileSync(path.substr(1), 'utf-8');
        data.replace(tplReg, function (all, tplId, tplContent) {
            compileds += 'Simplite.compiles["' + tplId + '"]=function (data) {return (function(' + Simplite.dataKey + '){'
                + Simplite.toCodeBlock(tplContent)
                + '}).call(Simplite, data);},';
        })
        return '';
    });
    return ';' + compileds + content;
};