module.exports = function (params) {
    var callback = params.callback;
    var resp = {
        err_no : 0,
        err_msg: 'aaaa',
        data: [
            {
                id: 1,
                text: '类型1'
            },
            {
                id: 2,
                text: '类型2'
            }
        ]
    };
    if (callback) {
        return callback + '(' + JSON.stringify(resp) + ')';
    }
    return resp;
};