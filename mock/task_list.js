module.exports = function (params) {
    var callback = params.callback;
    var resp = {
        status: 200,
        sleep: 2000,
        data: [
            {
                id: 12,
                name: '任务1'
            },
            {
                id: 23,
                name: '任务2'
            }
        ]
    };
    return callback + '(' + JSON.stringify(resp) + ')';
};