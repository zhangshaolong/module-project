module.exports = function (params) {
    var callback = params.callback;
    var resp = {
        err_no : 0,
        err_msg: '',
        data: {}
    };
    if (callback) {
        return callback + '(' + JSON.stringify(resp) + ')';
    }
    return resp;
};