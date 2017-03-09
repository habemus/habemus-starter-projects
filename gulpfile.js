const child_process = require('child_process');
const path = require('path');

const mergeStream = require('merge-stream');
const runSequence = require('run-sequence');

const gulp = require('gulp');
const gulpZip = require('gulp-zip');
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

/**
 * Compiles jekyll website
 */
gulp.task('distribute:jekyll', function (done) {

  var opts = {
    cwd: path.join(__dirname, 'src'),
  };

  child_process.execFile('jekyll', ['build'], opts, (error, stdout, stderr) => {

    if (error) {
      throw error;
    }

    done();
  });
});

/**
 * Generates zip files for each starter project
 */
gulp.task('distribute:zip-starter-projects', function () {
  var projects = fse.readdirSync(STARTER_PROJECTS_BASE_PATH);

  var zipStreams = projects.map((projectName) => {

    var projectPath = path.join(STARTER_PROJECTS_BASE_PATH, projectName);

    return gulp.src(path.join(projectPath, 'website/**/*'))
      .pipe(gulpZip('website.zip'))
      .pipe(gulp.dest(projectPath));
  });

  var allStreams = mergeStream();

  zipStreams.forEach((stream) => {
    allStreams.add(stream);
  });

  return allStreams;
});

/**
 * Copies resulting jekyll website to the final dist dir and 
 * executes post processing over files
 */
gulp.task('distribute:copy', function () {
  return gulp.src('src/_site/**/*')
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
})

gulp.task('distribute', function (done) {
  fse.removeSync(path.join(__dirname, 'dist'));

  return runSequence('distribute:jekyll', 'distribute:zip-starter-projects', 'distribute:copy');
});
