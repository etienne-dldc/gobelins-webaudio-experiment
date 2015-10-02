'use strict';
​
var gulp                = require('gulp');
var sass                = require('gulp-sass');
var babel               = require("gulp-babel");
var plumber             = require('gulp-plumber');
var browserSync         = require('browser-sync').create();
var autoprefixer        = require('gulp-autoprefixer');
var minifyCss           = require('gulp-minify-css');
var filter              = require('gulp-filter');
var filter              = require('gulp-rimraf');

/*
 * Config
 */
 // Path
var src = {
  path 	  : 'app',
  styles 	: ['app/styles/**/*.scss'],
  scripts : 'app/scripts/**/*.js',
  vendor	: 'app/vendor',
  assets  : 'app/assets'
};
var dist = {
  path    : 'app/public',
  styles 	: 'app/public/styles',
  scripts : 'app/public/scripts',
  vendor	: 'app/public/vendor',
  assets  : 'app/puclic'
};
// Autiprefix
var autoPrefixerBrowers = [
	'chrome >             = 34',
	'safari >             = 7',
	'opera >              = 23',
	'ios >                = 7',
	'android >            = 4.0',
	'bb >                 = 10',
	'ie >                 = 10',
	'ie_mob >             = 10',
	'ff >                 = 30'
];
​
/*
 * Server
 */
gulp.task('server', ['styles'], function() {
​
    browserSync.init({
        server: "./public"
    });
​
  gulp.watch(src.style, ['styles']);
  gulp.watch(src.assets, ['assets']).on('change', browserSync.reload);
});

/*
 * Clean 'dist' folder
 */
gulp.task('clean', function() {
	gulp.src(dist.path, {read: false}).pipe(rimraf());
});
​
/*
 * Copy 'assets'
 */
gulp.task('assets', function() {
  gulp.src()
    .pipe( gulp.dest(dist.assets) );
});
​
/*
 * Scripts
 */
gulp.task("scripts", function () {
  return gulp.src( src.scripts )
    .pipe(babel())
    .pipe( gulp.dest(dist.scripts) );
});
​
/*
 * Compile SCSS
 */
gulp.task('styles', function () {
  gulp.src(scr.styles)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(autoPrefixerBrowers))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest( dist.styles ))
    .pipe(browserSync.stream());
});
​
gulp.task('default', ['styles', 'server']);
