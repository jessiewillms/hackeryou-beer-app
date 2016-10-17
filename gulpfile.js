"use strict";

// Include gulp
var gulp = require('gulp');

// npm install gulp npm install gulp-notify gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename gulp-autoprefixer
var sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    notify = require("gulp-notify"),
    autoprefixer = require('gulp-autoprefixer');
    // livereload = require('gulp-livereload');
// 
    
// Compile Our Sass
gulp.task('css-task', function() {
  return gulp.src('styles/*.scss')
    // .pipe(livereload())
    .pipe(sass({
        'sourcemap=none': true,
        errLogToConsole: true
    }))
    .on("error", notify.onError(function(error) {
        return "Message to the notifier: " + error.message;
    }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest('styles/'))
    .pipe(notify('You are good at programming and have nice hair!'))
    
});

gulp.task('autoprefix', function () {
    return gulp.src('styles/style.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('styles/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    // livereload.listen();
    gulp.watch('styles/*.scss', ['css-task']);
});

// Default Task
gulp.task('default', ['css-task', 'autoprefix', 'watch']);