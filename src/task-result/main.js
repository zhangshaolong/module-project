define(function (require, exports) {

    require('tpl!/tpl/task-result.tpl');
    var service = require('service/task-result');
    var querys = require('common/utils').getQuery();
    var formatJSON = require('common/utils').formatJSON;

    var render = {
        taskinfo: function (data, contentNode) {
            contentNode.html('<pre>' + formatJSON(data, true) + '</pre>');
        },
        loginfo: function (data, contentNode) {
            contentNode.html('<pre>' + data.debug + '</pre>');
        },
        result: function (data, contentNode) {
            var html = Simplite.render('task-result-main-result-table', data.result);
            contentNode.html(html);
        },
        chart: function (data, contentNode) {
            contentNode.html(data);
        }
    };

    var refreshTabContent = function (type, contentNode) {
        service.getTaskResult({
            type: type,
            taskid: querys.id,
            historyid: querys.hid
        }).done(function (resp) {
            render[type](resp.data, contentNode);
        });
    };

    exports.init = function () {
        var moduleNode = this.element;
        var html = Simplite.render('task-result-main');
        moduleNode.html(html);

        var contents = moduleNode.find('.nav-contents > div');
        var tabs = moduleNode.find('.nav-tabs > li');
        moduleNode.on('click', '.nav-tabs > li', function () {
            contents.hide();
            tabs.removeClass('active');
            $(this).addClass('active');
            refreshTabContent($(this).data('type'), $(contents.get($(this).data('idx'))).show());
        });
        $(tabs.get(2)).trigger('click');
    }
});