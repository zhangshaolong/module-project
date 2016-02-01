var md5 = require('./md5');
var path = require('path');
var fs = require('fs');
var through = require('through2');
var config = require('./config');
module.exports = function () {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        var moduleCode = {};
        content = content.replace(config.mainJsRule, function (all, modulePath) {
            var absPath = path.resolve(path.join('.', config.buildPath, config.jsPath, modulePath + '.js'));
            var hashCode = md5(absPath);
            var suffix = '_' + hashCode + '.js';
            var desAbsPath = absPath.replace('.js', suffix);
            var readStream = fs.createReadStream(absPath);
            var writeStream = fs.createWriteStream(desAbsPath);
            readStream.pipe(writeStream);
            moduleCode[modulePath] = modulePath + '_' + hashCode;
            return all;
        })
        .replace(/require\(\[(['"])main\1\]\)/, function (all) {
            var config = ''
                +     'requirejs.config({'
                +         'paths: ' + JSON.stringify(moduleCode)
                +     '});'
            return config + all;
        });
        file.contents = new Buffer(content);
        this.push(file);
        return callback();
    });
};

// module.exports = function () {
//     return through.obj(function (file, encoding, callback) {
//         var content = String(file.contents, encoding);
//         var moduleCode = {};
//         content = content.replace(config.mainJsRule, function (all, modulePath) {
//             var absPath = path.resolve('./' + config.buildPath + '/' + config.jsPath + '/' + modulePath + '.js');
//             var hashCode = md5(absPath);
//             var suffix = '_' + hashCode + '.js';
//             var desAbsPath = absPath.replace('.js', suffix);
//             var readStream = fs.createReadStream(absPath);
//             var writeStream = fs.createWriteStream(desAbsPath);
//             readStream.pipe(writeStream);
//             moduleCode[modulePath] = modulePath + '_' + hashCode;
//             return all;
//         })
//         .replace(/require\(\[(['"])main\1\]\)/, function (all) {
//             var config = ''
//                 +     'requirejs.config({'
//                 +         'paths: ' + JSON.stringify(moduleCode)
//                 +     '});'
//             return config + all;
//         });
//         file.contents = new Buffer(content);
//         this.push(file);
//         return callback();
//     });
// };