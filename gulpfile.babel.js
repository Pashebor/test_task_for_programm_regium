'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';
import prettify from 'gulp-html-prettify';
import inject  from 'gulp-inject-string';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import gulpImports from 'gulp-imports';

var paths = {
  all: 'app/sass/*.scss',
  sass: 'app/sass/styles.scss',
  images: 'app/assets/images/*',
  html: 'app/index.html',
  scripts: 'app/js/app.js',
  fonts: 'app/assets/fonts/*'
};

gulp.task('fonts', () => {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('./build/fonts'));
});

gulp.task('inject', () => {
    gulp.src(paths.html)
        .pipe(inject.before('<title>', '\n<link rel="stylesheet" href="css/styles.css">\n'))
        .pipe(inject.before('</body>', '\n<script type="text/javascript" src="js/app.js"></script>\n'))
        .pipe(gulp.dest('build'));
});

gulp.task('compress', function () {
  return gulp.src(paths.scripts)
    .pipe(babel({
            presets: ['es2015']
        }))
    .pipe(gulpImports())
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('prettify:html', function() {
  gulp.src(paths.html)
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./build/'))
});

gulp.task('sass', function() {
  return gulp.src(paths.sass)
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(gulp.dest('build/css'));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
  .pipe(imagemin({optimizationLevel: 5}))
  .pipe(gulp.dest('build/img'));
});

gulp.task('watch', function() {
   gulp.watch(paths.sass, ['sass']);
   gulp.watch(paths.all, ['sass']);
   gulp.watch(paths.images, ['images']);
   gulp.watch(paths.scripts, ['compress']);
});

gulp.task('default', ['watch', 'sass', 'images', 'fonts', 'compress', 'inject']);
gulp.task('build', ['sass', 'images', 'fonts', 'compress', 'inject']);
