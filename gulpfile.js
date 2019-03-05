'use strict';
// 02/26/2019 David Churn created
//  Start this on the command line "gulp watch"
//  Watching for font, html, images, javascript, and scss changes

// Known to do
// ? How likely is it to have multiple HTML files? Will handle multiple
// 1) Evaluate JShint messages...
// ? Should images and Fonts be part of watch process?  Yes, evaluate.
// 6) Test all the processes.  Verify watchers are working.

// third party modules
const gulp = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const image = require('gulp-image');
const jshint = require('gulp-jshint');
const rename = require('gulp-rename');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

// looks for index.html in the same directory as this gulp file.
function bsInit() {
  browserSync.init({
       server: "./build/"
   });
}

// local modules

// Move font files
//  show file size(s)
function moveFonts() {
  return gulp.src('./dev/fonts/*.*')
    .pipe(size({showFiles:true, ShowTotal:true}))
    .pipe(gulp.dest('./build/fonts/'))
}

// Move HTML file(s)
//  show file sizes
//  refresh the browser with the new markup
function moveHTML() {
  return gulp.src('./dev/*.html')
    .pipe(size({showFiles:true, ShowTotal:true}))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream())
}

// Image file handling
//  compress image files (includes file sizes)
//  show total size of all image files
//  refresh the browser with the new pictures.
function compressImages() {
  return gulp.src('./dev/images/*.*')
    .pipe(image())
    .pipe(size())
    .pipe(gulp.dest('./build/images/'))
}

// JavaScript file handling.
//  add source file markers to JavaScript (sourcemaps)
//  regress any version 6 code to version 5 compliant (babel)
// >> Provide hints for common errors <<
//  merge all the JavaScript files together (concat)
//  shrink code to remove extraneous stuff (uglify)
//  write the sourcemaps information
//  show the final javascript file size
//  write the result file to build
//  refresh the browser with the new code
function buildJS() {
  return gulp.src('./dev/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(size())
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream())
}

// Sass file handling
//  add source file markers to scss files (sourcemaps)
//  compile the scss file into a css files (sass)
//  add source file markers to css statements (autoprefixer)
//  show the compiled css file size
//  write the compiled css to build for a readable version
//  shrink code to remove unused commangs (cleanCSS)
//  rename result file to show it is minimized (rename)
//  write the sourcemaps information
//  show the minimized css file size
//  write the minimized result file to build
//  refresh the browser with the new code
function buildScss () {
  return gulp.src('./dev/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(size({showFiles:true}))
    .pipe(gulp.dest('./build/'))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'}))
    .pipe(sourcemaps.write())
    .pipe(size({showFiles:true}))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream())
}

// watchers
function watchFonts() {
  gulp.watch('./dev/fonts/*.*',handleFonts);
}
function watchHTML() {
  gulp.watch('./dev/*.html',handleHTML);
}
function watchImages() {
  gulp.watch('./dev/images/*.*',handleImages)
}
function watchJS() {
  gulp.watch('./dev/scripts/*.js', handleJS)
}
function watchScss() {
  gulp.watch('./dev/scss/**/*.scss',handleScss)
}

// Action starts here!
console.log(`gulpfile starts...`);

let handleFonts = gulp.series(moveFonts);
gulp.task('onlyFonts', handleFonts);

let handleHTML = gulp.series(moveHTML);
gulp.task('onlyHTML', handleHTML);

let handleImages = gulp.series(compressImages);
gulp.task('onlyImages', compressImages);

let handleJS = gulp.series(buildJS);
gulp.task('onlyJS', handleJS);

let handleScss = gulp.series(buildScss);
gulp.task('onlyScss',handleScss);

// Build from dev
let buildDev = gulp.series(handleFonts, handleHTML, handleImages, handleJS, handleScss);
gulp.task('build', buildDev);

// Kick off every process then watch for changes
let watchers = gulp.parallel(bsInit, watchFonts, watchHTML, watchImages, watchJS, watchScss);

let buildNWatch = gulp.series(buildDev, watchers);
gulp.task('watch', buildNWatch);
