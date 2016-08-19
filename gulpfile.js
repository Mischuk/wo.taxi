'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var connect = require('gulp-connect');
var autoprefixer = require('autoprefixer-stylus');
var buffer = require('vinyl-buffer');
var del = require('del');
var fs = require('fs');
var jade = require('gulp-jade');
var jstransformer = require('jstransformer');
var jstransformerStylus = require('jstransformer-stylus');
var path = require('path');
var posthtmlAttrsSorter = require('posthtml-attrs-sorter');
var runSequence = require('run-sequence');
var rupture = require('rupture');
var jeet = require('jeet');
var stylus = require('stylus');
var jadeInheritance = require('gulp-jade-inheritance');
var sourcemaps = require('gulp-sourcemaps');

// Error handler for gulp-plumber
var errorHandler = function (err) {
  $.util.log([(err.name + ' in ' + err.plugin).bold.red, '', err.message, ''].join('\n'));

  if ($.util.env.beep) {
    $.util.beep();
  }

  this.emit('end');
};

// Print object in console
var debugObj = function (obj) {
  var util = require('util');
  console.log(util.inspect(obj, {showHidden: false, depth: null}));
};

var correctNumber = function correctNumber(number) {
  return number < 10 ? '0' + number : number;
};

// Return timestamp
var getDateTime = function getDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = correctNumber(now.getMonth() + 1);
  var day = correctNumber(now.getDate());
  var hours = correctNumber(now.getHours());
  var minutes = correctNumber(now.getMinutes());
  return year + '-' + month + '-' + day + '-' + hours + minutes;
};

// https://github.com/stylus/stylus/issues/1872#issuecomment-86553717
var stylusFileExists = function() {
  return function(style) {
    style.define('file-exists', function(path) {
      return !!stylus.utils.lookup(path.string, this.paths);
    });
  };
};

// Plugins options
var options = {
  del: [
    'dest',
    'tmp'
  ],

  plumber: {
    errorHandler: errorHandler
  },

  stylus: {
    use: [
      rupture(),
      jeet(),
      autoprefixer({
        cascade: false,
        browsers: [
          'last 2 version',
          'Chrome >= 20',
          'Firefox >= 20',
          'Opera >= 12',
          'Android 2.3',
          'Android >= 4',
          'iOS >= 6',
          'Safari >= 5',
          'Explorer >= 8'
        ]
      }),
      stylusFileExists()
    ],
    'include css': false
  },

  include: {
    hardFail: true,
    includePaths: [
      __dirname + "/",
      __dirname + "/node_modules",
      __dirname + "/source/modules/"
    ]
  },

  cssbeautify: {
    indent: '\t',
    autosemicolon: true
  },

  jade: {
    pretty: '\t'
  },

  htmlPrettify: {
    'unformatted': ['pre', 'code'],
    'indent_with_tabs': true,
    'preserve_newlines': true,
    'brace_style': 'expand',
    'end_with_newline': true
  },

  posthtml: {
    plugins: [
      posthtmlAttrsSorter({
        order: [
          'class',
          'id',
          'name',
          'data',
          'ng',
          'src',
          'for',
          'type',
          'href',
          'values',
          'title',
          'alt',
          'role',
          'aria'
        ]
      })
    ],
    options: {}
  }
};
// Local server
gulp.task('connect', function () {
  connect.server({
    root: ['dest'],
    livereload: true
  });
});

//Jade
gulp.task('jade', function() {
  return gulp.src(['**/*.jade', '!**/_*.jade'], {cwd: 'source'})
    .pipe($.plumber(options.plumber))
    .pipe($.changed('dest', {extension: '.html'}))
    .pipe($.if(global.isWatching, $.cached('templates')))
    .pipe($.jadeInheritance({basedir: '/source/'}))
    .pipe($.filter(function (file) {
      return !/source[\\\/]modules/.test(file.path);
    }))
    .pipe($.jade(options.jade))
    .pipe($.posthtml(options.posthtml.plugins, options.posthtml.options))
    .pipe($.prettify(options.htmlPrettify))
    .pipe($.flatten())
    .pipe(gulp.dest('dest'))
    .pipe(connect.reload());
});

// Stylus
gulp.task('stylus', function () {
  return gulp.src('source/static/styl/app.styl')
    .pipe($.plumber(options.plumber))
    .pipe(sourcemaps.init())
    .pipe($.stylus(options.stylus))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dest/styles'))
    .pipe(connect.reload());
});

// Images
gulp.task('images', function () {
  return gulp.src('source/static/images/**/*.{jpg,gif,svg,png}')
    .pipe(gulp.dest('dest/images'))
    .pipe(connect.reload());
});

// Fonts
gulp.task('fonts', function () {
  return gulp.src('**/*.{eot,ttg,svg,woff}', {cwd: 'source/static/fonts'})
    .pipe(gulp.dest('dest/fonts'))
    .pipe(connect.reload());
});


// Scripts
gulp.task('jsModules', function () {
  return gulp.src(['source/modules/**/*.js'])
    .pipe($.plumber(options.plumber))
    .pipe($.include(options.include))
    .pipe($.concat('modules.js', { newLine: '\n\n' }))
    .pipe($.flatten())
    .pipe(gulp.dest('tmp/js'));
});

gulp.task('jsMain', function () {
  return gulp.src("source/static/js/main.js")
    .pipe($.flatten())
    .pipe(gulp.dest("tmp/js"));
});

gulp.task('jsBuild', function () {
  return gulp.src("tmp/js/main.js")
    .pipe($.include({
      extensions: "js",
      hardFail: true,
      includePaths: [
        __dirname + "/tmp/js"
      ]
    }))
    .pipe($.rename({basename:'app'}))
    .pipe($.flatten())
    .pipe(gulp.dest("dest/js"))
    .pipe(connect.reload());
});

gulp.task('jsVendor', function () {
  return gulp.src(["source/static/js/jquery.min.js", "source/static/js/modernizr.js"])
    .pipe($.flatten())
    .pipe(gulp.dest("dest/js"));
});

gulp.task('jsPlugins', function () {
  return gulp.src(["source/static/js/**/*.js", "!source/static/js/jquery.min.js", "!source/static/js/modernizr.js", "!source/static/js/main.js"])
    .pipe($.plumber(options.plumber))
    .pipe($.concat('plugins.js', { newLine: '\n\n' }))
    .pipe($.flatten())
    .pipe(gulp.dest("dest/js"));
});

gulp.task('cssPlugins', function () {
  return gulp.src("source/static/js/**/*.css")
    .pipe($.plumber(options.plumber))
    .pipe($.concat('plugins.css', { newLine: '\n\n' }))
    .pipe($.flatten())
    .pipe(gulp.dest('dest/styles'))
    .pipe(connect.reload());
});


gulp.task('plugins', function () {
  return runSequence(
    'jsPlugins',
    'cssPlugins'
  );
});

gulp.task('js', function () {
  return runSequence(
    'jsModules',
    'jsMain',
    'jsBuild'
  );
});



gulp.task('dev', function () {
  return runSequence(
    'jade',
    'stylus',
    'fonts',
    'images',
    'jsVendor',
    'js',
    'plugins',
    'connect',
    'setWatch',
    'watch'
  );
});



// Zip
gulp.task('build-zip', function() {
  var datetime = '-' + getDateTime();
  var zipName = 'dist' + datetime + '.zip';

  return gulp.src('dest/**/*')
    .pipe($.zip(zipName))
    .pipe(gulp.dest('zip'));
});

// Build
gulp.task('build:templates', function() {
  return gulp.src(['**/*.jade', '!**/_*.jade'], {cwd: 'source'})
    .pipe($.plumber(options.plumber))
    .pipe($.changed('dest', {extension: '.html'}))
    .pipe($.if(global.isWatching, $.cached('templates')))
    .pipe($.jadeInheritance({basedir: '/source/'}))
    .pipe($.filter(function (file) {
      return !/source[\\\/]modules/.test(file.path);
    }))
    .pipe($.jade(options.jade))
    .pipe($.posthtml(options.posthtml.plugins, options.posthtml.options))
    .pipe($.prettify(options.htmlPrettify))
    .pipe($.flatten())
    .pipe(gulp.dest('dest'));
});
gulp.task('build:styles', function () {
  return gulp.src(['app.styl'], {cwd: 'source/static/styl'})
    .pipe($.stylus(options.stylus))
    .pipe($.cssbeautify(options.cssbeautify))
    .pipe($.csscomb())
    .pipe(gulp.dest('dest/styles'))
    .pipe($.csso())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('dest/styles'));
});
gulp.task('build:images', function () {
  return gulp.src('source/static/images/**/*.{jpg,gif,svg,png}')
    .pipe(gulp.dest('dest/images'));
});
gulp.task('build:fonts', function () {
  return gulp.src('**/*.{eot,ttg,svg,woff}', {cwd: 'source/static/fonts'})
    .pipe(gulp.dest('dest/assets/fonts'));
});
gulp.task('build:js', function () {
  return gulp.src("tmp/js/main.js")
    .pipe($.include({
      extensions: "js",
      hardFail: true,
      includePaths: [
        __dirname + "/tmp/js"
      ]
    }))
    .pipe($.flatten())
    .pipe($.rename({basename:'app', suffix: ''}))
    .pipe(gulp.dest("dest/js"))
    .pipe($.uglify())
    .pipe($.rename({basename:'app', suffix: '.min'}))
    .pipe(gulp.dest("dest/js"));
});
gulp.task('build:pluginsJS', function () {
  return gulp.src(["source/static/js/**/*.js", "!source/static/js/jquery.min.js", "!source/static/js/modernizr.js", "!source/static/js/main.js"])
    .pipe($.plumber(options.plumber))
    .pipe($.concat('plugins.js', { newLine: '\n\n' }))
    .pipe($.flatten())
    .pipe(gulp.dest("dest/js"))
    .pipe($.uglify())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest("dest/js"));
});
gulp.task('build:pluginsCSS', function () {
  return gulp.src("source/static/js/**/*.css")
    .pipe($.plumber(options.plumber))
    .pipe($.concat('plugins.css', { newLine: '\n\n' }))
    .pipe($.csscomb())
    .pipe($.flatten())
    .pipe(gulp.dest('dest/styles'))
    .pipe($.csso())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('dest/styles'));
});

gulp.task('cleanup', function (cb) {
  return del(options.del, cb);
});

gulp.task('build', function () {
  return runSequence(
    'cleanup',
    'build:templates',
    'build:styles',
    'build:images',
    'build:fonts',
    'jsVendor',
    [
      'jsModules',
      'jsMain'
    ],
    'build:js',
    'build:pluginsJS',
    'build:pluginsCSS'
  );
});


// Watching files
gulp.task( 'setWatch', function () {
  global.isWatching = true;
});

gulp.task('watch', function () {
  gulp.watch("source/**/*.jade", ['jade']);
  gulp.watch("source/**/*.styl", ['stylus']);
  gulp.watch("source/static/fonts/**/*.*", ['fonts']);
  gulp.watch("source/static/images/*.{jpg,gif,svg,png}", ['images']);
  gulp.watch("source/static/images/**/*.{jpg,gif,svg,png}", ['images']);
  gulp.watch("source/modules/**/*.js", ['js']);
  gulp.watch("source/static/js/**/*.js", ['jsPlugins']);
  gulp.watch("source/static/js/**/*.css", ['cssPlugins']);
});



// Default run task
gulp.task('default');