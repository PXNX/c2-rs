const browserify = require('browserify');
const gulp = require('gulp');
const log = require('gulplog');
const plumber = require('gulp-plumber');
const source = require('vinyl-source-stream');

function minimalExample(done) {
    return browserify({
        entries: [
            './main.ts'  // THIS LINE HAS CHANGED FROM THE QUESTION
        ],
        standalone: 'TestModule'
    })
        .transform('babelify')
        .bundle()
        .on('error', log.error)
        .pipe(source('minimalExample.js'))
        .pipe(plumber())
        .pipe(gulp.dest('./dist'));
}

module.exports = {
    minimalExample
};