define(function (require) {

    var uri = 'data:application/vnd.ms-excel;base64,';
    var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">'
        + '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">'
        + '<head>{cssText}<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>'
        + '<x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    var format = function (template, data) {
        return template.replace(/{([^\}]+)}/g, function(all, key) {
            return data[key];
        });
    };
    var base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
    };
    var Export = require('../../ui').create({
        init: function (options) {
            this.target = $(options.target);
            this.sheetName = options.sheetName || 'sheet';
            this.fileName = options.fileName || 'excel.xls';
            this.element.addClass('export-widget');
        },
        bindEvent: function () {
            var me = this;
            if (!me.element.size()) return;
            this.element.on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                me.export();
            });
        },
        export: function () {
            var styles = document.styleSheets;
            var cssText = '<style>';
            for (var i = 0, len = styles.length; i < len; i++) {
                var style = styles[i];
                var rules = style.cssRules || style.rules;
                for (var j = 0, l = rules.length; j < l; j++) {
                    cssText += rules[j].cssText + '\n';
                }
            }
            cssText += '</style>';
            var copy = this.target.clone();
            this.target.parent().append(copy);
            copy.find(':hidden').remove();
            var table = copy.html();
            copy.remove();
            var link = uri + base64(format(template, {
                worksheet: this.sheetName,
                table: table,
                cssText: cssText
            }));
            var a = document.createElement('a');
            a.download = this.fileName;
            a.href = link;
            a.click();
        }
    });
    return Export;
});