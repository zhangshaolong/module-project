/**
 * @file 模板块分析器，自动分析出多个模板块并进行编译
 * @author zhangshaolong
 */

define(function (require) {

    var tplMap = {};
    var tplReg = /\{\{\s*\-\-\s*tpl\s*\:\s*([^\}\s]+)\s*\-\-\s*\}\}\s*([\s\S]*?)\{\{\s*\-\-\s*\/tpl\s*\-\-\s*\}\}/g;
    return {
        load: function (resourceId, req, load, config) {
            var path = req.toUrl(resourceId);
            if (tplMap[path]) {
                load();
                return ;
            }
            tplMap[path] = 1;
            $.ajax({
                url: path,
                dataType: 'text',
                success: function (tpl) {
                    tpl.replace(tplReg, function (all, tplId, tplContent) {
                        Simplite.addTemplate(tplId, tplContent);
                        Simplite.compile(tplId, Simplite);
                    });
                    load();
                }
            });
        }
    };
});