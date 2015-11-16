module.exports = {
    "status" : 200,    // 请求状态: 200 -- success, !200 -- failed
    "error" : {  // 预留出来以后用
        "code" : 0,
        "message" : "abc"
    },
    "today" : { // 今日信息
        "natureFlow" : 1024, // 自然流量
        "tgFlow" : 1024, // 推广流量
        "scoreCost" : 1024 // 积分消耗
    },
    "total" : { // 汇总
        "natureFlow" : 1024, // 自然流量
        "tgFlow" : 1024, // 推广流量
        "scoreCost" : 1024 // 积分消耗
    },
    "data" : [ // 7日数据, 时间倒序
        {
            "date" : 1447232647442,// 日期
            "natureFlow" : 10, // 自然流量
            "tgFlow" : 10, // 推广流量
            "scoreCost" : 100 // 积分消耗
        },
        {
            "date" : 1447232647442,// 日期
            "natureFlow" : 20, // 自然流量
            "tgFlow" : 20, // 推广流量
            "scoreCost" : 150 // 积分消耗
        },
        {
            "date" : 1447232647442,// 日期
            "natureFlow" : 30, // 自然流量
            "tgFlow" : 30, // 推广流量
            "scoreCost" : 200 // 积分消耗
        },
        {
            "date" : 1447578307137,// 日期
            "natureFlow" : 35, // 自然流量
            "tgFlow" : 35, // 推广流量
            "scoreCost" : 300 // 积分消耗
        }
    ],
    "tgCourseCount" : 1024, // 推广课程数
    "teacherScore" : 1024, // 老师可用学分
    "orgScore" : 1024, // 机构可用学分
    "startTime" : 1024, // 推广开始时间
    "endTime" : 1024 // 推广结束时间
};
