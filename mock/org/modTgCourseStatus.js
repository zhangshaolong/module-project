module.exports = {
    "status": 200,    // 请求状态: 200 -- success, !200 -- failed
    "errorCode": {  // 预留出来以后用
        "code": 0,
        "message": "abc"
    },
    "isFirstUser": 0, // 是否是首次使用营销推广: 1 -- true, 0 -- false
    "orgTgStatus": 0 // 机构推广状态: 1 -- never, 2 -- ing, 4 -- done
};