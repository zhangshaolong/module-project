var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
module.exports = function () {
    return imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    });
};