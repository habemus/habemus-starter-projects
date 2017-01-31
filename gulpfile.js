const child_process = require('child_process');

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const gulpCheerio = require('gulp-cheerio');

function isCss(file) {
  return /\.css$/.test(file.path);
}

function isHtml(file) {
  return /\.html$/.test(file.path);
}

// HABEMUS.IO google analytics script
const GA_SCRIPT = `<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-71194663-5', 'auto');
  ga('send', 'pageview');

</script>`;

gulp.task('distribute', function (done) {

  child_process.execFile('jekyll', ['build'], (error, stdout, stderr) => {

    if (error) {
      throw error;
    }
    gulp.src('_site/**/*')
      .pipe(gulpIf(isCss, autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })))
      .pipe(gulpIf(isHtml, gulpCheerio(function ($, file, done) {

        $('body').append(GA_SCRIPT);

        done();
      })))
      .pipe(gulp.dest('dist'))
      .on('finish', done)
      .on('error', done);
  });
});
