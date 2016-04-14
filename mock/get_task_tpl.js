module.exports = function (params) {
    var callback = params.callback;
    var resp = {
        err_no : 0,
        err_msg: '',
        data: {
            conditions: [
                {
                    type: 'datehour',
                    name: 'datehour',
                    cname: '选择小时',
                    val: '',
                    tip: '请输入查询条件',
                    plchdr: 'assdf'
                },
                {
                    type: 'text',
                    name: 'search',
                    cname: '查询',
                    val: '',
                    tip: '请输入查询条件',
                    plchdr: 'assdf'
                },
                {
                    type: 'textarea',
                    name: 'sql',
                    cname: 'SQL',
                    val: 'select count(*) from omega.ods_web where concat(year,month,day,hour)=\'2016031911\' and eventid=\'OMGH5PageView\' and product_name=\'omega-web-site\' and attrs[\'v\'] not like \'%localhost%\';',
                    tip: 'select count(*) from omega.ods_web where concat(year,month,day,hour)=\'2016031911\' and eventid=\'OMGH5PageView\' and product_name=\'omega-web-site\' and attrs[\'v\'] not like \'%localhost%\';',
                    plchdr: '12'
                },
                {
                    type: 'select',
                    name: 'select',
                    cname: '下拉选择',
                    val: '',
                    tip: '',
                    list: [
                        {
                            id: 12,
                            text: '第一项'
                        },
                        {
                            id: 23,
                            text: '第二项'
                        }
                    ]
                }
            ]
        }
    };
    if (callback) {
        return callback + '(' + JSON.stringify(resp) + ')';
    }
    return resp;
};