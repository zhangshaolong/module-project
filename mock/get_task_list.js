module.exports = function (params) {
    var callback = params.callback;
    var resp = {
        err_no : 0,
        err_msg: '',
        data: {
            list: [
                {
                    historyid: 'adf',
                    taskid: '12',
                    owner: '创建者',
                    descr: '任务描述',
                    compute_name: '计算模型',
                    end_time: new Date().getTime(),
                    start_time: new Date().getTime(),
                    status: '队列中',
                    actions: [
                        'edit',
                        'task_detail',
                        'result_detail'
                    ]
                }
            ],
            total_size: 100
        }
    };
    if (callback) {
        return callback + '(' + JSON.stringify(resp) + ')';
    }
    return resp;
};