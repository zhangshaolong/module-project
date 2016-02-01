var gulp = require('gulp');
var through = require('through2');
var md5 = require('./md5');
var rename = require('gulp-rename');
var path = require('path');
var less = require('gulp-less');
var cssmin = require('gulp-minify-css');
var lessPluginFunction = require('less-plugin-functions');
var config = require('./config');
var prefixReg = new RegExp('^' + config.rootBase);
module.exports = function () {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        content = content.replace(config.lessRule, function (all, lessPath) {
            lessPath = lessPath.replace(prefixReg, '');
            var absPath = path.resolve('.' + lessPath + '.less');
            var hashCode = md5(absPath);
            var name = path.basename(absPath);
            var suffix = '_' + hashCode + '.css';
            gulp.src(lessPath.substr(1) + '.less')
            .pipe(less({ plugins: [new lessPluginFunction()] }))
            .pipe(cssmin())
            .pipe(rename(name.replace('.less', suffix)))
            .pipe(gulp.dest(path.join(config.buildPath, lessPath.substr(0, lessPath.lastIndexOf('/')))));
            return all.replace('.less', suffix);
        });
        file.contents = new Buffer(content);
        this.push(file);
        return callback();
    });
};

// var isAbsolutePath = function (path) {
//     return path.indexOf('/') === 0 && path.indexOf('//') !== 0;
// };
// module.exports = function () {
//     return through.obj(function (file, encoding, callback) {
//         var content = String(file.contents, encoding);
//         content = content.replace(config.lessRule, function (all, lessPath) {
//             if (isAbsolutePath(lessPath)) {
//                 lessPath = '.' + lessPath;
//             } else {
//                 lessPath = lessPath.replace('.', '');
//             }
//             var absPath = path.resolve(lessPath + '.less');
//             var hashCode = md5(absPath);
//             var name = path.basename(absPath);
//             var suffix = '_' + hashCode + '.css';
//             lessPath = lessPath.replace(/^\.\//, '');
//             gulp.src(lessPath + '.less')
//             .pipe(less({ plugins: [new lessPluginFunction()] }))
//             .pipe(cssmin())
//             .pipe(rename(name.replace('.less', suffix)))
//             .pipe(gulp.dest(config.buildPath + '/' + lessPath.substr(0, lessPath.lastIndexOf('/'))));
//             return all.replace('.less', suffix);
//         });
//         file.contents = new Buffer(content);
//         this.push(file);
//         return callback();
//     });
// };