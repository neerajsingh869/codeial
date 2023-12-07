const gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const imagemin = require('gulp-imagemin');

// Concat and minify CSS files
gulp.task('build-css', (done) => {
    gulp.src('./assets/scss/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/styles'));

    gulp.src('./assets/**/*.css')
      .pipe(rev())
      .pipe(gulp.dest('./public/assets'))
      .pipe(rev.manifest({
        cwd: 'public',
        base: 'public',
        merge: true
      }))
      .pipe(gulp.dest('./public/assets'));

    done();
});

// minify js files
gulp.task('build-js', (done) => {
  gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
      cwd: 'public',
      base: 'public',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

  done();
})

// minify images
gulp.task('build-images', (done) => {
  gulp.src('./assets/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
      cwd: 'public',
      base: 'public',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

  done();
})

// clear all assets
gulp.task('clean:assets', (done) => {
  del.sync('./public/assets');
  done();
})

// build all assets
gulp.task('build', gulp.series('clean:assets', 'build-css', 'build-js', 'build-images'), (done) => {
  done();
})