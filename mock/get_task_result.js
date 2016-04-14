module.exports = function (params) {
    var callback = params.callback;
    var resp = {
        err_no : 0,
        err_msg: '',
    };
    var type = params.type;
    var data = {
        taskinfo: {"compute_name":"Spark}'\"Sql","taskid":43,"owner":"zenghui","descr":"测试描述2","start_time":1460374445000,"end_time":1460374503000,"next_start_time":1460221200000,"status":"success","actions":"一次执行","runcmd":"sh ~/git/omega-spark/java/yarn-submit.sh taskid=43 className=SparkSql startDate=2016/04/10/00/00 duration=3600000 query=\"select * from omega.ods_native\" export=0 limit=20"},
        loginfo: {
            loginfo: 'sddsf'
        },
        result: {
            result: [
                {
                    keys: ['id', 'name'],
                    data: [
                        ['12', '名称'],
                        ['13', '错误时']
                    ]
                },
                {
                    keys: ['任务ID', '任务名称', '时长'],
                    data: [
                        ['12', '名称', '121S'],
                        ['13', '错误时', '12S']
                    ]
                },
                
            ]
        },
        chart: {
            chart: {
                type: '',
                data: []
            }
        }
    };
    resp.data = data[type];

    if (callback) {
        return callback + '(' + JSON.stringify(resp) + ')';
    }
    return resp;
};