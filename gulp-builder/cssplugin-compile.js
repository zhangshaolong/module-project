var fs = require('fs');
var path = require('path');
var config = require('./config');
var cwd = config.cwd;
module.exports = function (content, pth) {
    if (pth.indexOf(config.widgetsPath) > -1) {
        content = content.replace(config.cssPluginRule, function (all, pluginPath) {
            if (pluginPath.indexOf('.') === 0) { // 不会存在代码写在隐藏文件里面的情况
                pluginPath = path.join(path.dirname(pth), pluginPath);
            } else {
                pluginPath = path.join(cwd, pluginPath);
            }
            var data = fs.readFileSync(pluginPath, 'utf-8');
            return '\n(function () {var head = document.head || document.getElementsByTagName("head")[0];'
                + 'var style = document.createElement("style");'
                + 'style.setAttribute("type", "text/css");'
                + 'style.innerHTML = "' + data.replace(/"/g, '\\"').replace(/\s+/g, ' ') + '";'
                + 'head.appendChild(style);})();\n';
        });
    }
    return content;
};