var rjs = require('requirejs');
var config = require('./config');
module.exports = function () {
    return rjs.optimize({
        baseUrl: 'src',
        name: 'main',
        out: config.buildPath + '/' + config.jsPath + '/main.js'
    });
};