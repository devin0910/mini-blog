const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const postcss = require('gulp-postcss');
const shortcss = require('postcss-short');
const cssnext = require('postcss-cssnext');
const scss = require('postcss-scss');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const precss = require('precss');
const stripInlineComments = require('postcss-strip-inline-comments');
const prettyError = require('gulp-prettyerror');
const lost = require('lost');
const map = require('postcss-map');

gulp.task('css', function () {
    const plugins = [
        stripInlineComments,
        lost(),
        precss(),
        shortcss,
        cssnext({browsers: ['last 2 versions', 'ie >= 9']}),
        map({
          basePath: 'src/css/maps',
          maps: [
            'breakpoints.yml',
            'paddings.yml',
            'z.yml'
          ]
        })
    ];

    return gulp.src('src/css/style.css')
        .pipe(prettyError())
        .pipe(postcss(plugins, {syntax: scss}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['css', 'scripts', 'img', 'html'], function () {
    gulp.watch(['src/css/*.css', 'src/css/partials/*.css'], ['css']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/img/*.{png,gif,jpg,jpeg,svg}', ['img']);
    gulp.watch('src/*.html', ['html']);

    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('img', function () {
    return gulp.src('src/img/*.{png,gif,jpg,jpeg,svg}')
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
    return gulp.src('src/js/*.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
