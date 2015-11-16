define(function (require) {

    var tplMap = {};
    var tplReg = /\{\{\s*\-\-\s*tpl\s*\:\s*([^\}\s]+)\s*\-\-\s*\}\}\s*([\s\S]+?)\{\{\s*\-\-\s*\/tpl\s*\-\-\s*\}\}/g;
    return {
        load: function (resourceId, req, load, config) {
            var path = req.toUrl(resourceId);
            if (tplMap[path]) {
                load();
                return ;
            }
            tplMap[path] = 1;
            if (typeof $ === 'undefined') {
                load();
                return;
            }
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