const child_process = require('child_process');
const path = require('path');

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const gulpCheerio = require('gulp-cheerio');
const fse = require('fs-extra');

function isCss(file) {
  return /\.css$/.test(file.path);
}

const HTML_RE = /\.html$/;
const STARTER_PROJECTS_BASE_PATH = path.join(__dirname, 'src/_site/resources/starter-projects');
function shouldHaveGA(file) {
  return HTML_RE.test(file.path) &&
        // do not include starter project's files into the GA,
        // as they are loaded via iframe
        !file.path.startsWith(STARTER_PROJECTS_BASE_PATH);
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

  var opts = {
    cwd: path.join(__dirname, 'src'),
  };

  fse.removeSync(path.join(__dirname, 'dist'));

  child_process.execFile('jekyll', ['build'], opts, (error, stdout, stderr) => {

    if (error) {
      throw error;
    }
    gulp.src('src/_site/**/*')
      // css
      .pipe(gulpIf(isCss, autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })))
      // ga
      .pipe(gulpIf(shouldHaveGA, gulpCheerio(function ($, file, done) {
        $('body').append(GA_SCRIPT);
        done();
      })))
      .pipe(gulp.dest('dist'))
      .on('finish', done)
      .on('error', done);
  });
});
