'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require("gulp-babel");
var plumber  = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var filter = require('gulp-filter');
var del = require('del');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

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
  path    : 'public',
  styles 	: 'public/styles',
  scripts : 'public/scripts',
  vendor	: 'public/scripts',
  assets  : 'public'
};

/*
 * Server
 */
gulp.task('server', ['styles', 'scripts', 'assets'], function() {

  browserSync.init({
      server: dist.path
  });

  gulp.watch(src.style, ['styles']);
  gulp.watch(src.scripts, ['scripts']).on('change', browserSync.reload);
  gulp.watch(src.assets, ['assets']).on('change', browserSync.reload);
});

/*
 * Clean 'dist' folder
 */
gulp.task('clean', function() {
  setTimeout(function() {
    return del([dist.path]);
  }, 100);
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
    .pipe( concat('app.js') )
    .pipe( gulp.dest(dist.scripts) );
});

/*
 * Vendors
 */
gulp.task("vendors", function () {
  return gulp.src( src.vendors )
    .pipe( concat('vendors.js') )
    .pipe( gulp.dest(dist.vendors) );
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

gulp.task('default', ['clean', 'server']);
