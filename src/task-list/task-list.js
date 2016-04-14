define(function (require, exports) {

    var service = require('service/task-list');

    var Pager = require('common/widgets/pager/pager');

    var utils = require('common/utils');

    var vh = utils.getQuery('vh');

    var taskId = utils.getQuery('id');

    var allActions = {
        'start': '<button class="btn btn-primary btn-xs task-start" type="button">启动</button>',
        'stop': '<button class="btn btn-danger btn-xs task-stop" type="button">停止</button>',
        'edit': '<button class="btn btn-primary btn-xs task-edit" type="button">编辑</button>',
        'copy': '<button class="btn btn-primary btn-xs task-copy" type="button">复制</button>',
        'task_detail': '<a class="btn btn-primary btn-xs" href="/task/list?id=${taskid}&vh=1">查看任务</a>',
        'result_detail': '<a class="btn btn-primary btn-xs" target="_blank" href="/task/result?id=${taskid}&hid=${historyid}">查看结果</a>',
    };

    Simplite.addFilter('getActions', function (item) {

        var actions = item.actions || [];
        
        var acts = [];
        for (var i = 0, len = actions.length; i < len; i++) {
            acts.push(allActions[actions[i]].replace(/\$\{([^\}]+)\}/g, function (all, key) {
                return item[key];
            }));
        }
        return acts.join(' | ');
    })

    var refreshTaskList = function (filters, moduleNode, pager) {
        var df;
        if (vh) {
            df = service.getHistoryTaskList(filters);
        } else {
            df = service.getTaskList(filters);
        }
        return df.done(function (resp) {
            var data = resp.data;
            data.vh = vh;
            var html = Simplite.render('task-list-task-list-tbody', data);
            moduleNode.find('.task-tbody').html(html);

            var totalCount = data.total_size;
            var totalPage = parseInt((totalCount - 1) / filters.pagesize) + 1;
            moduleNode.find('.page-count').text(totalPage);
            pager.render({
                currentPage: +filters.currentpage,
                totalPage: totalPage
            });
        });
    }

    exports.init = function () {

        var moduleNode = this.element;

        var filters = {
            currentpage: 1,
            pagesize: 20
        };
        if (vh) {
            filters.taskid = taskId;
        }

        var html = Simplite.render('task-list-task-list', {
            vh: vh
        });
        moduleNode.html(html);
        var pager = Pager.init({
            element: moduleNode.find('.pager-container'),
            displayPageCount: 15
        });
        pager.on('page', function (args) {
            filters.currentpage = args.currentPage;
            refreshTaskList(filters, moduleNode, pager);
        });

        refreshTaskList(filters, moduleNode, pager);

        moduleNode.on('click', '.task-start', function () {
            service.opTask({
                taskid: $(this).parent().data('id'),
                type: 'start'
            }).done(function (resp) {
                window.location.reload(true);
            }).fail(function (resp) {
                alert(resp.err_msg);
            });
        })
        .on('click', '.task-stop', function () {
            service.opTask({
                taskid: $(this).parent().data('id'),
                type: 'stop'
            }).done(function (resp) {
                window.location.reload(true);
            }).fail(function (resp) {
                alert(resp.err_msg);
            });
        })
        .on('click', '.task-edit', function () {
            window.location.href = window.rootBase + '/task/add?id=' + $(this).parent().data('id');
        })
        .on('click', '.task-copy', function () {
            window.location.href = window.rootBase + '/task/add?cp=1&id=' + $(this).parent().data('id');
        });
    };
});