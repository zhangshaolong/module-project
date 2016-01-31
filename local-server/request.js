var http = require('http');

module.exports = function (options, callback) {
    return http.request(options, callback);
};