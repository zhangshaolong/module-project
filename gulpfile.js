var gulp = require('gulp');
var connect = require('gulp-connect');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var htmlmin = require('gulp-htmlmin');
var rjs = require('requirejs');
var rev = require('gulp-rev');
var clean = require('gulp-clean');
var sequence = require('gulp-sequence');
var through = require('through2');
var lessPluginFunction = require('less-plugin-functions');
var fs = require('fs');

var pageJSBulder = function () {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);
        content.replace(/\<body data\-module\-path="([^"]+)"/, function (all, path) {
            rjs.optimize({
                baseUrl: 'src',
                name: path,
                paths: {
                    tpl: 'common/tpl',
                    jockey: 'common/jockey'
                },
                shim: {
                    'jockey': {
                        exports: 'jockey'
                    }
                },
                stubModules: ['tpl'],
                optimizeAllPluginResources: false,
                onBuildRead: function (moduleName, pth, contents) {
                    if (moduleName === path) {
                        contents = tplBuilder(contents);
                    }
                    return contents;
                },
                onBuildWrite: function (moduleName, path, contents) {
                    if (moduleName === 'tpl') {
                        return '';
                    }
                    return contents.replace(/(['"])tpl\!/g, '$1tpl');
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

var tplBuilder = function (content) {
    var tplDefines = [];
    content.replace(/["']tpl!([^"']+)["']/g, function (all, path) {
        var data = fs.readFileSync(path.substr(1), 'utf-8');
        var tplDefine = ''
            + 'define("tpl!' + path + '", function () {'
                + 'var tplReg = /\\{\\{\\s*\\-\\-\\s*tpl\\s*\\:\\s*([^\\}\\s]+)\\s*\\-\\-\\s*\\}\\}\\s*([\\s\\S]+?)\\{\\{\\s*\\-\\-\\s*\\/tpl\\s*\\-\\-\\s*\\}\\}/g;'
                +   '"' + data.replace(commentTrimReg, commentTrimHandler).replace(/"/g, '\\"').replace(/\s+/g, ' ') + '".replace(tplReg, function (all, tplId, tplContent) {'
                +       'Simplite.addTemplate(tplId, tplContent);'
                +       'Simplite.compile(tplId, Simplite);'
                +   '});'
            + '})';
        tplDefines.push(tplDefine);
    });
    return ';' + tplDefines.join(';') + ';' + content;
};

var pageLessBuilder = function () {
    return through.obj(function (file, encoding, callback) {
        var content = String(file.contents, encoding);

        content = content.replace(/\<link.*?href=["']([^"']+?)\.less["']/g, function (all, lessPath) {
            lessPath = lessPath.substr(1);
            gulp.src(lessPath + '.less')
            .pipe(less({ plugins: [new lessPluginFunction()] }))
            .pipe(gulp.dest('output/' + lessPath.substr(0, lessPath.lastIndexOf('/'))));
            return all.replace('.less', '.css');
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

gulp.task('imagemin', function() {
    return gulp.src('img/**/*.{png,jpg,gif,ico}')
    .pipe(cache(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
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
    gulp.src('view/**/*.html')
    .pipe(require('./local-server/html').htmlWriter())
    .pipe(htmlmin(options))
    .pipe(pageJSBulder())
    .pipe(pageLessBuilder())
    .pipe(gulp.dest('output/view'));
});

gulp.task('connect', function() {
    return connect.server({
        middleware: function(connect, opt) {
            return [
                require('./local-server/html').htmlProxy,
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

    gulp.src('dep/**/*.js')
    .pipe(gulp.dest('output/dep'));
});

gulp.task('proxy', function() {
    return connect.server({
        middleware: function(connect, opt) {
            return [
                require('./local-server/proxy'),
                require('./local-server/less'),
                require('./local-server/html').htmlProxy
            ];
        }
    });
});

gulp.task('build', sequence(
    'clean',
    ['htmlmin', /*'imagemin',*/ 'main', 'copy'] // 图片依赖libc.so.6: version `GLIBC_2.14'
));

gulp.task('default', ['connect']);