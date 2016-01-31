var rjs = require('requirejs');
var config = require('./config');
module.exports = function () {
    return rjs.optimize({
        baseUrl: 'src',
        name: 'main',
        paths: {
            tpl: 'common/tpl',
            dep: './../dep'
        },
        out: config.buildPath + '/' + config.jsPath + '/main.js'
    });
};