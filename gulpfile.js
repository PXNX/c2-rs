const gulp = require("gulp");
const minify = require("gulp-babel-minify");

gulp.task("minify", () =>
    gulp.src("./main.cjs")
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(gulp.dest("./dist"))
);


function defaultTask(cb) {
    gulp.src("./main.cjs")
        .pipe(minify({
            mangle: {
                keepClassName: true
            }
        }))
        .pipe(gulp.dest("./dist"))
    cb();
}

exports.default = defaultTask