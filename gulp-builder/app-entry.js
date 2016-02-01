var rjs = require('requirejs');
var path = require('path');
var config = require('./config');
module.exports = function () {
    return rjs.optimize({
        baseUrl: 'src',
        name: 'main',
        paths: {
            tpl: 'common/tpl',
            dep: './../dep'
        },
        out: path.join(config.buildPath, config.jsPath, 'main.js')
    });
};