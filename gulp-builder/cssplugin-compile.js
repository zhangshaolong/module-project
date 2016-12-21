var fs = require('fs');
var path = require('path');
var less = require('less');
var config = require('./config');
var cwd = config.cwd;
var buildedMap = {};
module.exports = function (content, pth) {
    if (pth.indexOf(config.widgetsPath) > -1) {
        content = content.replace(config.cssPluginRule, function (all, pluginPath) {
            if (pluginPath.indexOf('.') === 0) { // 不会存在代码写在隐藏文件里面的情况
                pluginPath = path.join(path.dirname(pth), pluginPath);
            } else {
                pluginPath = path.join(cwd, pluginPath);
            }
            var cssContent = buildedMap[pluginPath];
            if (!cssContent) {
                var data = fs.readFileSync(pluginPath, 'utf-8');
                var css = data;
                less.render(css, {
                    sync: true
                }, function (e, cssobj) {
                    css = cssobj.css;
                });
                cssContent = buildedMap[pluginPath] = '\n(function () {var head = document.head || document.getElementsByTagName("head")[0];'
                    + 'var style = document.createElement("style");'
                    + 'style.setAttribute("type", "text/css");'
                    + 'style.innerHTML = "' + css.replace(/"/g, '\\"').replace(/\s+/g, ' ') + '";'
                    + 'head.appendChild(style);})();\n';
            }
            return cssContent;
        });
    }
    return content;
};