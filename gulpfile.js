const gulp = require('gulp');
const sweetjs = require("gulp-sweetjs");
const sourcemaps = require('gulp-sourcemaps');

// Macro packages
const bdd = "sweet-bdd";

gulp.task('default', function() {
  console.log("Use either the 'build' or 'test' tasks");
});

gulp.task("build", function () {
    gulp.src("test-src/**/*")
    .pipe(sourcemaps.init())
    .pipe(sweetjs({
        modules: ["sweet-bdd"],
        readableNames: true
    }))
    .pipe(sourcemaps.write("../sourcemaps/test"))
    .pipe(gulp.dest("test"));

});