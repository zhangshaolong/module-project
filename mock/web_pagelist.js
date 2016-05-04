module.exports = function (params) {
    return {
        status: 200,
        data: {
            list: [
                {
                    page_url: 'http://omega.jizi.com/crash/list?app_id=10000',
                    page_name: 'crash列表页',
                    pvs: 100000,
                    uvs: 300,
                    ips: 500
                },
                {
                    page_url: 'http://omega.jizi.com/crash/detail?app_id=10000&msgid=3237923d-88fe-46ec-90f9-91efac5c6533',
                    page_name: 'crash详情页',
                    pvs: 100000,
                    uvs: 300,
                    ips: 500
                },
                {
                    page_url: 'http://omega.jizi.com/crash/list?app_id=10000',
                    page_name: 'crash列表页',
                    pvs: 100000,
                    uvs: 300,
                    ips: 500
                },
                {
                    page_url: 'http://omega.jizi.com/crash/list?app_id=10000',
                    page_name: 'crash列表页',
                    pvs: 100000,
                    uvs: 300,
                    ips: 500
                }
            ],
            total: 100
        }
    };
}