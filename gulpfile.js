'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require("gulp-babel");
var plumber  = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var filter = require('gulp-filter');
var clean = require('gulp-clean');

/*
 * Config
 */
var src = {
  path 	  : 'app',
  styles 	: ['app/styles/**/*.scss'],
  scripts : 'app/scripts/**/*.js',
  vendor	: 'app/vendor',
  assets  : 'app/assets/**/*'
};
var dist = {
  path    : 'app/public',
  styles 	: 'app/public/styles',
  scripts : 'app/public/scripts',
  vendor	: 'app/public/vendor',
  assets  : 'app/public'
};

/*
 * Server
 */
gulp.task('server', ['clean', 'styles', 'scripts', 'assets'], function() {

  browserSync.init({
      server: "./app/public"
  });

  gulp.watch(src.style, ['styles']);
  gulp.watch(src.scripts, ['scripts']).on('change', browserSync.reload);
  gulp.watch(src.assets, ['assets']).on('change', browserSync.reload);
});

/*
 * Clean 'dist' folder
 */
gulp.task('clean', function() {
	gulp.src(dist.path, {read: false})
    .pipe(clean());
});

/*
 * Copy 'assets'
 */
gulp.task('assets', function() {
  gulp.src( src.assets )
    .pipe( gulp.dest(dist.assets) );
});

/*
 * Scripts
 */
gulp.task("scripts", function () {
  return gulp.src( src.scripts )
    .pipe( babel() )
    .pipe( gulp.dest(dist.scripts) );
});

/*
 * Compile SCSS
 */
gulp.task('styles', function () {
  gulp.src(src.styles)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
    }))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest( dist.styles ))
    .pipe(browserSync.stream());
});

gulp.task('default', ['server']);
