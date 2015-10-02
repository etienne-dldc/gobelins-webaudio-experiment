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
var runSequence = require('run-sequence');


/*
 * Config
 */
var src = {
  path 	  : 'app',
  styles 	: ['app/styles/**/*.scss'],
  scripts : 'app/scripts/**/*.js',
  vendors	: 'app/vendors/**/*.js',
  vendorsBase : 'app/vendors/',
  assets  : 'app/assets/**/*'
};
var dist = {
  path    : 'public',
  styles 	: 'public/styles',
  scripts : 'public/scripts',
  vendors	: 'public/scripts',
  assets  : 'public'
};


/*
 * Server
 */
gulp.task('server', function() {

  browserSync.init({
      server: dist.path
  });

  gulp.watch(src.styles, ['styles']);
  gulp.watch(src.scripts, ['scripts']).on('change', browserSync.reload);
  gulp.watch(src.vendors, ['vendors']).on('change', browserSync.reload);
  gulp.watch(src.assets, ['assets']).on('change', browserSync.reload);
});

/*
 * Clean 'dist' folder
 */
gulp.task('clean', function(cb) {
  return del([dist.path]);
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
  return gulp.src([
    src.vendorsBase + 'p5.min.js',
    src.vendors
  ])
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

gulp.task('default', function () {
  runSequence('clean',
              ['assets', 'styles', 'scripts', 'vendors'],
              'server');
});
