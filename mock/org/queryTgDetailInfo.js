module.exports = {
    "status" : 200,    // 请求状态: 200 -- success, !200 -- failed
    "error" : {  // 预留出来以后用
        "code" : 0,
        "message" : "abc"
    },
    "data" : [ // 10日数据, 时间倒序
        {
            "date" : 1024, // 日期
            "natureFlow" : 1024, // 自然流量
            "tgFlow" : 1024, // 推广流量
            "scoreCost" : 1024 // 积分消耗
        },
        {
            "date" : 10, // 日期
            "natureFlow" : 104, // 自然流量
            "tgFlow" : 104, // 推广流量
            "scoreCost" : 1024 // 积分消耗
        },
        {
            "date" : 1024, // 日期
            "natureFlow" : 1024, // 自然流量
            "tgFlow" : 1024, // 推广流量
            "scoreCost" : 1024 // 积分消耗
        }
    ]
}