module.exports = function (id) {

    var name = '张三\n12 sfdsd /nsdfsf ';
    if (id == 1) {
        name = 'id为1时返回的名字';
    }
    return {
        status: 200,
        data: {
            id: id,
            name: name
        }
    };
}