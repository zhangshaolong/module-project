var gulp = require('gulp');
var clean = require('gulp-clean');
var sequence = require('gulp-sequence');
var config = require('./gulp-builder/config');
var server = require('./local-server/server');
var uglify = require('gulp-uglify');
var path = require('path');

var htmlIncludeProcessor = require('./gulp-builder/html-include');
var htmlminProcessor = require('./gulp-builder/html-min');
var jsmd5Processor = require('./gulp-builder/md5-js');
var htmlJsProcessor = require('./gulp-builder/html-js');
var htmlLessProcessor = require('./gulp-builder/html-less');
var appEntryProcessor = require('./gulp-builder/app-entry');
var imageminProcessor = require('./gulp-builder/image-min');

var buildPath = config.buildPath;
var htmlPath = config.htmlPath;

gulp.task('clean', function() {
    return gulp.src(buildPath, {read: false})
        .pipe(clean({force: true}));
});

gulp.task('jsmd5', function() {
    return gulp.src(path.join(buildPath, htmlPath, '/**/*.html'))
        .pipe(jsmd5Processor())
        .pipe(gulp.dest(path.join(buildPath, htmlPath)));
});

gulp.task('imagemin', function() {
    return gulp.src('img/**/*.{png,jpg,gif,ico}')
        .pipe(imageminProcessor())
        .pipe(gulp.dest(path.join(buildPath, 'img')));
});

gulp.task('htmlmin', function () {
    return gulp.src(path.join(htmlPath, '*.html'))
        .pipe(htmlIncludeProcessor(config.rootBase))
        .pipe(htmlminProcessor())
        .pipe(htmlJsProcessor())
        .pipe(htmlLessProcessor())
        .pipe(gulp.dest(path.join(buildPath, htmlPath)));
});

gulp.task('main', appEntryProcessor);

gulp.task('copy', function () {
    gulp.src(['dep/**/*.*', '!dep/**/bootstrap.js', '!dep/simplite.js'])
        .pipe(gulp.dest(path.join(buildPath, 'dep')));
    gulp.src(['dep/**/bootstrap.js', 'dep/simplite.js'])
        .pipe(uglify())
        .pipe(gulp.dest(path.join(buildPath, 'dep')));
});

gulp.task('build', sequence(
    // 'clean',
    ['htmlmin', 'imagemin', 'main', 'copy'], // 图片依赖libc.so.6: version `GLIBC_2.14'
    'jsmd5'
));

gulp.task('connect', server);

gulp.task('default', ['connect']);