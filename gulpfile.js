'use strict';

var gulp = require('gulp'),
    merge = require('merge-stream'),
    pf = require('./js/paramFiles'),
    sourcemaps = require('gulp-sourcemaps'),
    vulcanize = require('gulp-vulcanize'),
    flatten = require('gulp-flatten'),
    // css
    csscomb = require('gulp-csscomb'),
    autoprefixer = require('autoprefixer-core'),
    csswring = require('csswring'),
    postcss = require('gulp-postcss'),
    // js
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs'),
    // CONSTANTS
    SCSS_PATH = 'style/scss',
    JS_PATH = 'js',
    COMPONENT_PATH = 'components',
    PUBLIC_CSS = 'public/css';

/**
 * Linting SCSS files
 * Possible send files to param -files=...
 */
gulp.task('csslint', function() {
  var files = pf.paramFiles(),
      stream,
      global,
      components;

  if (files) {
    stream = gulp.src(files)
      .pipe(csscomb(__dirname + '/.csscomb.json'))
      .pipe(gulp.dest('./'));

  } else {
    stream = gulp.src(pf.scss(SCSS_PATH))
      .pipe(csscomb(__dirname + '/.csscomb.json'))
      .pipe(gulp.dest(SCSS_PATH));

    // components = gulp.src(pf.scss(COMPONENT_PATH))
    //   .pipe(csscomb(__dirname + '/.csscomb.json'))
    //   .pipe(gulp.dest(COMPONENT_PATH));

    // stream = merge(global, components);
  }

  return stream;
});

/**
 * Processing SCSS files
 */
gulp.task('css', ['csslint'], function() {
  var processors = [
    autoprefixer({
      browsers: ['last 1 version']
    }),
    csswring({
      removeAllComments: true
    })
  ];

  return gulp.src([pf.scss(SCSS_PATH), pf.scss(COMPONENT_PATH)])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write(PUBLIC_CSS + '/map'))
    .pipe(flatten())
    .pipe(gulp.dest(PUBLIC_CSS));
});

/**
 * Linting JS files
 * Possible send files to param -files=...
 */
gulp.task('jslint', function() {
  var files = pf.paramFiles();

  if (!files) {
    files = [pf.js(JS_PATH), pf.js(COMPONENT_PATH)];
  }

  return gulp.src(files)
    .pipe(jshint.extract())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jscs())
    .pipe(jshint.reporter('fail'));
});

/**
 * 
 */
gulp.task('component', ['js', 'css'], function() {
  return gulp.src('index.html')
    .pipe(vulcanize({
      dest: 'public',
      strip: true,
      inline: true
    }))
    .pipe(gulp.dest('public'));
});

/**
 * Processing JS files
 */
gulp.task('js', ['jslint'], function() {
});

gulp.task('default', ['component']);
