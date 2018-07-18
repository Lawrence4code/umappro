// ---------  ALL REQUIRED PLUGIN ---------- //
const gulp = require('gulp');

const rename = require('gulp-rename');
const browserSync = require('browser-sync');
var reload = browserSync.reload;
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

// ------------ ERROR HANDLING ------------- //

function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}

// -------------- SCRIPT TASK -------------- //

gulp.task('scripts', function() {
  gulp
    .src('app/js/scriptMain.js')
    .pipe(rename('script.js'))
    .pipe(gulp.dest('app/js/'))
    .pipe(
      reload({
        stream: true
      })
    );
});

// --------------- STYLES TASK -------------- //

gulp.task('styles', function() {
  gulp
    .src('app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .on('error', console.error.bind(console))
    .pipe(autoPrefixer('last 2 versions'))
    .pipe(gulp.dest('app/css/'))
    .pipe(
      reload({
        stream: true
      })
    );
});

// ------------ IMAGE COMPRESSION ----------- //

gulp.task('image', function() {
  gulp
    .src('app/resources/images/*')
    .pipe(
      imagemin([
        imagemin.jpegtran({
          progressive: true
        }),
        imagemin.optipng({
          optimizationLevel: 5
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest('app/images'));
});

// --------------- HTML TASK --------------- //

gulp.task('html', function() {
  gulp.src('app/**/*.html').pipe(
    reload({
      stream: true
    })
  );
});

// Browser-sync Task //
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: './app/'
    }
  });
});

// --------------- WATCH TASK -------------- //

gulp.task('watch', function() {
  gulp.watch('app/sass/**/*.scss', ['styles']);
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/js/*.js', ['scripts']);
});

// --------------- DEFAULT TASK -------------- //

gulp.task('default', [
  'scripts',
  'html',
  'styles',
  'image',
  'browser-sync',
  'watch'
]);
