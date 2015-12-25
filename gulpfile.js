var gulp = require('gulp');
var connect = require('gulp-connect');
var less = require('gulp-less');
var cssmin = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var htmlmin = require('gulp-htmlmin');
var rjs = require('requirejs');
var clean = require('gulp-clean');

var sequence = require('gulp-sequence');
var rename = require('gulp-rename');
var through = require('through2');
var lessPluginFunction = require('less-plugin-functions');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var commentTrimReg = /(?:(["'])[\s\S]*?\1)|(?:\/\/.*\n)|(?:\/\*([\s\S])*?\*\/)/g;

var commentTrimHandler = function (all) {
    var start = all.charAt(0);
    switch (start) {
        case '/' :
            return '';
        case '"' :
        case "'" :
            return all;
    }
};

var md5 = function (filepath, cut) {
    cut = cut || 10;
    var shasum = crypto.createHash('md5');
    var fileContent = fs.readFileSync(filepath);
    shasum.update(fileContent);
    return shasum.digest('hex').substring(0, cut);
};

var pageJSBulder = function () {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        content.replace(/\<body data\-module\-path="([^"]+)"/, function (all, path) {
            rjs.optimize({
                baseUrl: 'src',
                name: path,
                paths: {
                    tpl: 'common/tpl'
                },
                stubModules: ['tpl'],
                optimizeAllPluginResources: false,
                onBuildRead: function (moduleName, pth, contents) {
                    return tplBuilder(contents);
                },
                onBuildWrite: function (moduleName, pth, contents) {
                    if (moduleName === 'tpl') {
                        return '';
                    }
                    return contents.replace(commentTrimReg, commentTrimHandler).replace(/(['"])tpl\!/g, '$1tpl');
                },
                out: 'output/asset/' + path + '.js'
            });
            content = content.replace(/baseUrl\s*:\s*["']\/src["'],/, 'baseUrl: \'\/asset\',');
            file.contents = new Buffer(content);
            return all;
        });
        this.push(file);
        return callback();
    });
};

var tplCache = {};
var tplBuilder = function (content) {
    var tplDefines = [];
    content.replace(/["']tpl!([^"']+)["']/g, function (all, path) {
        var compiled = tplCache[path];
        if (!compiled) {
            var data = fs.readFileSync(path.substr(1), 'utf-8');
            compiled = ''
                + 'define("tpl!' + path + '", function () {'
                    + 'var tplReg = /\\{\\{\\s*\\-\\-\\s*tpl\\s*\\:\\s*([^\\}\\s]+)\\s*\\-\\-\\s*\\}\\}\\s*([\\s\\S]+?)\\{\\{\\s*\\-\\-\\s*\\/tpl\\s*\\-\\-\\s*\\}\\}/g;'
                    +   '"' + data.replace(commentTrimReg, commentTrimHandler).replace(/"/g, '\\"').replace(/\s+/g, ' ') + '".replace(tplReg, function (all, tplId, tplContent) {'
                    +       'Simplite.addTemplate(tplId, tplContent);'
                    +       'Simplite.compile(tplId, Simplite);'
                    +   '});'
                + '})';
            tplCache[path] = compiled;
        }
        tplDefines.push(compiled);
    });
    return ';' + tplDefines.join(';') + ';' + content;
};

var pageLessBuilder = function () {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);

        content = content.replace(/\<link.*?href=["']([^>]+?)\.less["']/g, function (all, lessPath) {
            var absPath = path.resolve('.' + lessPath + '.less');
            var hashCode = md5(absPath);
            var name = path.basename(absPath);
            var suffix = '_' + hashCode + '.css';
            gulp.src(lessPath.substr(1) + '.less')
            .pipe(less({ plugins: [new lessPluginFunction()] }))
            .pipe(cssmin())
            .pipe(rename(name.replace('.less', suffix)))
            .pipe(gulp.dest('output/' + lessPath.substr(0, lessPath.lastIndexOf('/'))));
            return all.replace('.less', suffix);
        });
        file.contents = new Buffer(content);
        this.push(file);
        return callback();
    });
};

var jsVersion = function () {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        var moduleCode = {};
        content = content.replace(/\<body data\-module\-path="([^"]+)"/, function (all, modulePath) {
                var absPath = path.resolve('./output/asset/' + modulePath + '.js');
                var hashCode = md5(absPath);
                var suffix = '_' + hashCode + '.js';
                var desAbsPath = absPath.replace('.js', suffix);
                var readStream = fs.createReadStream(absPath);
                var writeStream = fs.createWriteStream(desAbsPath);
                readStream.pipe(writeStream);
                moduleCode[modulePath] = modulePath + '_' + hashCode;
                return all;
            })
            .replace(/<\/body>/, function (all) {
                var config = ''
                    + '<script>'
                    +     'requirejs.config({'
                    +         'paths: ' + JSON.stringify(moduleCode)
                    +     '});'
                    + '</script>';
                return config + all;
            });
        file.contents = new Buffer(content);
        this.push(file);
        return callback();
    });
};

gulp.task('clean', function() {
    return gulp.src('output', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('jsVersion', function() {
    return gulp.src('output/view/**/*.html')
            .pipe(jsVersion())
            .pipe(gulp.dest('output/view/'));
})

gulp.task('imagemin', function() {
    return gulp.src('img/**/*.{png,jpg,gif,ico}')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('output/img'));
});

gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src('view/**/*.html')
        .pipe(require('./local-server/html').htmlWriter())
        .pipe(htmlmin(options))
        .pipe(pageJSBulder())
        .pipe(pageLessBuilder())
        .pipe(gulp.dest('output/view'));
});

// 为了同时和多个rd进行联调，支持多个端口访问
// 支持设置p参数，比如：gulp -p 8081
var argv = require('yargs').argv;
gulp.task('connect', function() {
    var port = argv.p || 8080;
    return connect.server({
        port: port,
        middleware: function(connect, opt) {
            return [
                require('./local-server/router'),
                require('./local-server/mock'),
                require('./local-server/less')
            ];
        }
    });
});

gulp.task('main', function () {
    return rjs.optimize({
        baseUrl: 'src',
        name: 'base',
        out: 'output/asset/base.js'
    });
});

gulp.task('copy', function () {
    gulp.src('css/iconfont/**')
    .pipe(gulp.dest('output/css/iconfont'));

    gulp.src('dep/**/*.*')
    .pipe(gulp.dest('output/dep'));
});

gulp.task('build', sequence(
    'clean',
    ['htmlmin', 'imagemin', 'main', 'copy'], // 图片依赖libc.so.6: version `GLIBC_2.14'
    'jsVersion'
));

gulp.task('default', ['connect']);