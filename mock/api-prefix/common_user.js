function (params) {

    var name = '张三\n12 sfdsd /nsdfsf ';
    if (params.id == 1) {
        name = 'id为1时返回的名字';
    }
    return {
        status: 200,
        data: {
            id: params.id,
            name: name
        }
    };
}