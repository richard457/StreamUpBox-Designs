var elixir = require('laravel-elixir');
elixir(function(mix) {
    // mix.sass('app.scss');
    mix.sass('_notification.scss');
    // mix.phpUnit();
});

 var  gulp = require('gulp'),
 autoprefix = require('gulp-autoprefixer'),
 minifyCSS = require('gulp-minify-css'),
 concat = require('gulp-concat'),
 changed = require('gulp-changed'),
 stripDebug = require('gulp-strip-debug'),
 uglify = require('gulp-uglify'),
 jshint     = require('gulp-jshint'),
 cssnano = require('gulp-cssnano'),
sass = require('gulp-ruby-sass')


 // sprite = require('gulp-sprite-generator'),

 ngAnnotate = require('gulp-ng-annotate'),//for adding what i messed
 sourcemaps = require('gulp-sourcemaps'),
 gulp = require('gulp'),
 gutil = require('gulp-util'),
 browserSync = require('browser-sync').create(),
 runSequence = require('run-sequence'),
 uglify = require('gulp-uglify'),
 gulpIf = require('gulp-if'),
 useref = require('gulp-useref'),
autoprefixer = require('gulp-autoprefixer'),

 // ngmin = require('gulp-ngmin'),

input  = {
      'html': './App/views/*.html',
      'sass': './scss/*.scss',
      'javascript':  './App/scripts/**/*.js'
    },

    output = {
      'html': './public/build/html',
      'stylesheets': './public/build',
      'javascript': './public/build/scripts'
    };
gulp.task('browserSync', function() {
      browserSync.init({
        server: {
          baseDir: 'StrimUp.com'//put your own folder name here
        },
      })
});
gulp.task('useref', function(){
  return gulp.src('/resources/views/users/home.blade.php')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('public/build/html'))
});

var compileSASS = function (filename, options) {
  return sass('./public/scss/*.scss', options)
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(output.stylesheets+'/css'))
        .pipe(browserSync.stream());
};
gulp.task('sass', function() {
    return compileSASS('main.css', {});
});

gulp.task('welcome',function(){
    gulp.src([
              './public/bower_resources/bootstrap/dist/css/bootstrap.min.css',
              './public/css/custom/*.css',
              './public/css/AdminLTE.css',
              './public/css/scroll.css',
              './public/css/AdminLTE.min.css',
              './public/css/notification.css',
              './public/css/register.css'
             ])
    .pipe(concat('welcome.min.css'))
    .pipe(gulp.dest('./public/build/styles/'));
});

gulp.task('angular', function(){
    gulp.src(
          [

            './public/bower_resources/jquery/dist/jquery.min.js',
            './public/bower_resources/angular/angular.min.js',
            './public/App/lib/angular-upload.js',
            // './public/lib/ionic/js/ionic.bundle.min.js',
            // './public/lib/ionic/js/ionic.material.min.js',
            './public/bower_resources/angular-animate/angular-animate.min.js',
            './public/bower_resources/angular-route/angular-route.min.js',
            './public/bower_resources/angular-aria/angular-aria.min.js',
            './public/bower_resources/angular-messages/angular-messages.min.js',
            './public/lib/ionic/js/svg-assets-cache.js',
            './public/bower_resources/angular-material/angular-material.min.js',


            './public/bower_resources/angular-bootstrap/ui-bootstrap-tpls.min.js',

            './public/bower_resources/angular-bootstrap/ui-bootstrap-tpls.js',
            './public/bower_resources/ng-dialog/js/ngDialog.min.js',
            './public/bower_resources/jquery/dist/jquery.min.js',
            './public/bower_resources/bootstrap/dist/js/bootstrap.min.js',

            './public/bower_resources/Caret.js/dist/jquery.caret.js',
            './public/bower_resources/jquery.atwho/dist/js/jquery.atwho.min.js',
            './public/bower_resources/bootstrap/dist/js/bootstrap.js',
            './public/lib/ionic/js/prefixfree.min.js',

            './public/bower_resources/angular-ui-router/release/angular-ui-router.js',
            './public/bower_resources/pdfjs-dist/build/pdf.js',
            './public/bower_resources/angular-pdf-viewer/dist/angular-pdf-viewer.min.js',
            './public/bower_resources/mousetrap/mousetrap.js',
            './public/bower_resources/ng-contextmenu/dist/ng-contextmenu.min.js',
            './public/bower_resources/angular-loading-bar/src/loading-bar.js',
            
            './public/App/vendor/angular-file-saver.bundle.min.js',
            './public/App/vendor/jquery-file-download.js',
            './public/bower_resources/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',


            './public/bower_resources/angular-ui-router.stateHelper/statehelper.min.js',
            './public/bower_resources/notie/dist/notie.js',
            './public/bower_resources/pouchdb/dist/pouchdb.min.js',
            './public/bower_resources/angular-sanitize/angular-sanitize.js',
            './public/bower_resources/angular-translate/angular-translate.js',
            './public/bower_resources/angular-ui-select/dist/select.min.js'
            




        ])
    .pipe(concat('angular.js'))
    .pipe(gulp.dest('./public/build/scripts/'));
});
/* run javascript through jshint */
gulp.task('jshint', function() {
  return gulp.src(input.javascript)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
// gulp.task('additional', function() {

//   return gulp.src([
//     './public/lib/angular-upload.js',
//     './public/build/scripts/modules.js'
//   ])
//    .pipe(concat('modules.js'))
//    .pipe(gulp.dest(output.javascript));
// });
gulp.task('imagemin', function() {
  var imgSrc = './public/images/**/*',
      imgDst = './public/build/images';
  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

/* concat javascript files, minify if --type production */
gulp.task('build-js', function() {
  // runSequence('angular');
  
  return gulp.src(input.javascript)
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
      .pipe(concat('modules.js'))
      //only uglify if gulp is run with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.javascript));
    // runSequence('additional');
});

gulp.task('watch', function() {
  // gulp.watch(input.javascript,['additional']);
  gulp.watch(input.javascript, ['jshint', 'build-js']);
  gulp.watch(input.sass, ['sass']);
  
  // gulp.watch(input.sass, ['build-css']);
  // gulp.watch(input.html, ['copy-html']);
});
gulp.task('default', [ 'jshint', 'build-js', 'watch']);
