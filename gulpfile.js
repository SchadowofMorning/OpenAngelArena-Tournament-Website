const gulp = require('gulp')
const sass = require('gulp-ruby-sass')
const run = require('gulp-run')
const cleanCSS = require('gulp-clean-css')
const clean = require('gulp-clean')
const del = require('del')
gulp.task('sass', () => {
  sass('src/scss/*.scss')
  .on('error', sass.logError)
  .pipe(gulp.dest('src/css'))
})

gulp.task('minifycss', () => {
  gulp.src('src/css/*.css')
  .pipe(cleanCSS())
  .pipe(gulp.dest('app/public/css'))
})
gulp.task('cleanup', () =>{
  del(["src/css/*.css"])
  del(["app/public/css/*.css"])
})
gulp.task('deploy', ()=>{
  gulp.src('app')
  .pipe(gulp.dest('../../Server/Deploy/Heroku/OpenAngelArena-Tournament-Website'))
})
gulp.task('compile', ['cleanup', 'sass', 'minifycss'])
