var gulp = require('gulp');
var clean = require('gulp-clean');
var sequence = require('gulp-sequence');
var server = require('./local-server/server');

var htmlIncludeProcessor = require('./gulp-builder/html-include');
var htmlminProcessor = require('./gulp-builder/html-min');
var jsmd5Processor = require('./gulp-builder/md5-js');
var htmlJsProcessor = require('./gulp-builder/html-js');
var htmlLessProcessor = require('./gulp-builder/html-less');
var appEntryProcessor = require('./gulp-builder/app-entry');
var imageminProcessor = require('./gulp-builder/image-min');
var config = require('./gulp-builder/config');
var buildPath = config.buildPath;
var htmlPath = config.htmlPath;

gulp.task('clean', function() {
    return gulp.src(buildPath, {read: false})
        .pipe(clean({force: true}));
});

gulp.task('jsmd5', function() {
    return gulp.src(buildPath + '/' + htmlPath + '/**/*.html')
        .pipe(jsmd5Processor())
        .pipe(gulp.dest(buildPath + '/' + htmlPath + '/'));
})

gulp.task('imagemin', function() {
    return gulp.src('img/**/*.{png,jpg,gif,ico}')
        .pipe(imageminProcessor())
        .pipe(gulp.dest(buildPath + '/img'));
});

gulp.task('htmlmin', function () {
    return gulp.src(htmlPath + '/**/*.html')
        .pipe(htmlIncludeProcessor())
        .pipe(htmlminProcessor())
        .pipe(htmlJsProcessor())
        .pipe(htmlLessProcessor())
        .pipe(gulp.dest(buildPath + '/' + htmlPath));
});

gulp.task('main', appEntryProcessor);

gulp.task('copy', function () {
    gulp.src('dep/**/*.*')
        .pipe(gulp.dest(buildPath + '/dep'));
});

gulp.task('build', sequence(
    'clean',
    ['htmlmin', 'imagemin', 'main', 'copy'], // 图片依赖libc.so.6: version `GLIBC_2.14'
    'jsmd5'
));

gulp.task('connect', server);

gulp.task('default', ['connect']);