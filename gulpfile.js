var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var merge = require('merge-stream');

// 1. Compile sass to css
// 2. Concatenate output to a file called main.css
// 3. Store main.css in `dist` folder
gulp.task('sass', function () {
  return gulp.src('app/_assets/styles/main.scss')
    .pipe(sass({
      //outputStyle: 'compressed',
      sourceComments : 'normal'
    })
    .on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/_assets/styles'));
});
 
gulp.task('watch:sass', function () {
  return gulp.watch('app/**/*.scss', ['sass']);
});

gulp.task('copy', function () {
  var images = gulp
    .src('app/_assets/images/*')
    .pipe(gulp.dest('dist/_assets/images'));

  var fonts = gulp.src('bower_components/bootstrap-sass/assets/fonts/*/*')
    .pipe(gulp.dest('dist/_assets/fonts'));

  return merge(images, fonts);
})

gulp.task('build', function () {
  return gulp.run(['sass', 'copy']);
})

