const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint7');
const browserSync = require('browser-sync').create();

const dirs = {
  src: 'src',
  dist: 'dist',
};

const paths = {
  styles: {
    src: `${dirs.src}/scss/styles.scss`,
    dist: `${dirs.dist}/css/`,
    wildcard: `${dirs.src}/scss/**/*.scss`,
  },
  scripts: {
    src: `${dirs.src}/scripts/custom.js`,
    dist: `${dirs.dist}/js/`,
    wildcard: `${dirs.src}/scripts/**/*.js`,
  },
  images: {
    src: `${dirs.src}/images/**/*.*`,
    dist: `${dirs.dist}/images`,
  },
  templates: {
    src: `${dirs.src}/templates/index.html`,
    dist: dirs.dist,
  },
};

const serve = (done) => {
  browserSync.init({
    server: {
      baseDir: './dist',
      index: 'index.html',
      directory: false,
      https: false,
    },
    watch: true,
    port: 8083,
    open: true,
    cors: true,
    notify: false,
  });
  done();
};

const fontawesomeFonts = (done) => {
  gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest(`${dirs.dist}/webfonts/`));
  done();
};

const styles = (done) => {
  gulp.src([paths.styles.src])
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', function (error) {
      console.log(error.toString());
      this.emit('end');
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dist));
  done();
};

const lintScripts = (done) => {
  gulp.src([paths.scripts.wildcard])
    .pipe(eslint({
      configFile: '.eslintrc',
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  done();
};

const scripts = (done) => {
  gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/@popperjs/core/dist/umd/popper.min.js',
    paths.scripts.src,
  ])
    .pipe(babel({
      presets: ['@babel/env'],
    }))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(paths.scripts.dist));
  done();
};

const images = (done) => {
  gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dist));
  done();
};

const templates = () => gulp.src(paths.templates.src)
  .pipe(gulp.dest(paths.templates.dist));

const watch = (done) => {
  gulp.watch(paths.styles.wildcard, gulp.series('styles')).on('change', browserSync.reload);
  gulp.watch(paths.scripts.wildcard, gulp.series('scripts')).on('change', browserSync.reload);
  gulp.watch(paths.templates.src, gulp.series('templates')).on('change', browserSync.reload);
  done();
};

gulp.task('fontawesome:fonts', fontawesomeFonts);
gulp.task('styles', styles);
gulp.task('lintScripts', lintScripts);
gulp.task('scripts', scripts);
gulp.task('images', images);
gulp.task('templates', templates);
gulp.task('serve', serve);
gulp.task('watch', watch);

gulp.task('default', gulp.parallel('fontawesome:fonts', 'styles', 'lintScripts', 'scripts', 'images', 'templates', 'serve', 'watch'));
