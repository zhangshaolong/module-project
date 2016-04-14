define(function (require, exports) {

    var service = require('service/task-add');
    var utils = require('common/utils');
    var Dropdown = require('common/widgets/dropdown/dropdown');

    var datetimepichers = [];
    var dropdowns = [];

    var taskId = utils.getQuery('id');
    var isCopy = utils.getQuery('cp') == 1;

    Simplite.addFilter('datetimepicher', function (id) {
        datetimepichers.push(id);
        return '';
    });
    
    Simplite.addFilter('dropdown', function (id, item) {
        dropdowns.push([id, item]);
        return '';
    });

    exports.init = function () {

        var moduleNode = this.element;

        var refreshTaskForm = function (type) {
            var args = {
                type: type
            };
            if (taskId) {
                args.taskid = taskId;
            }
            service.getTaskTpl(args).done(function (resp) {
                var html = Simplite.render('task-add-task-add-nav-content', resp.data);
                moduleNode.find('.nav-content').html(html);
                moduleNode.find('[data-toggle="tooltip"]').tooltip();
                for (var i = 0, len = datetimepichers.length; i < len; i++) {
                    $('#' + datetimepichers[i]).datetimepicker({
                        format: 'yyyy/mm/dd/hh',
                        autoclose: true,
                        language: 'zh-CN',
                        startView: 2,
                        minView: 1,
                        viewSelect: 'decade'
                    });
                };
                for (var i = 0, len = dropdowns.length; i < len; i++) {
                    var item = dropdowns[i][1];
                    var id = dropdowns[i][0];
                    var dropdown = Dropdown.init({
                        element: '#' + id,
                        name: item.name,
                        value: item.val
                    });
                    dropdown.render(item.list, item.val);
                };
            });
        }

        service.getTaskTypeList().done(function (resp) {
            var html = Simplite.render('task-add-task-add', resp.data);
            moduleNode.html(html);

            var dropdown = Dropdown.init({
                element: '.task-selector',
                value: resp.data[0].id,
                name: 'type'
            });
            dropdown.render(resp.data);
            dropdown.on('change', function (item) {
                refreshTaskForm(item.id);
            });
        });

        moduleNode.on('click', '.add-task', function () {
            var args = $.extend({}, utils.getFormData(moduleNode));
            if (taskId && !isCopy) {
                args.taskid = taskId;
            }
            service.addTask(args).done(function (resp) {
                moduleNode.find('.modal').modal('show').data('status', 1).find('.status-content').html('创建任务成功~');
            }).fail(function (resp) {
                moduleNode.find('.modal').modal('show').data('status', 0).find('.status-content').html(resp.err_msg);
            })
        })

        .on('click', '.confirm-task-btn', function () {
            if (moduleNode.find('.modal').data('status')) {
                location.reload(true);
            }
        });

        setTimeout(function () {
            $(moduleNode.find('.task-type')[0]).trigger('click');
        }, 10);
    };
});