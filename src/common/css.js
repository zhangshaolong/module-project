/**
 * @file Css样式加载器
 * @author zhangshaolong
 */

define(function (require) {

    var cssMap = {};

    return {
        load: function (resourceId, req, load, config) {
            if (typeof document === 'undefined') {
                load();
                return;
            }
            var head = document.getElementsByTagName('head')[0];
            var path = req.toUrl(resourceId);
            if (!cssMap[path]) {
                cssMap[path] = 1;
                var link = document.createElement('link');
                link.href = path;
                link.setAttribute('rel', 'stylesheet');
                head.appendChild(link);
            }
            load();
        }
    };
});