var coffee = require('gulp-coffee');
var gulp   = require('gulp');
var gutil  = require('gulp-util');
var browserSync = require('browser-sync');
var reload = browserSync.reload
var feedReader = require('./lib/feedReader.js')
var through2  = require('through2')

// Static server
gulp.task('watch', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('./coffee/*.coffee', ['coffee'])
    gulp.watch('./js/*.js').on('change', reload)
});

gulp.task('replace', function() {
  gulp.src('./lib/index.html')
    .pipe(through2.obj(function(file, encoding, cb) {
      var _this = this
      feedReader(function(result){
        file.contents = new Buffer(file.contents.toString().replace("<!-- BLOG ARTICLES -->", result.join(' ')))
        _this.push(file);
        cb();
      });
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('coffee', function() {
  gulp.src('./coffee/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./js/'));
});