import gulp from "gulp";
import { deleteAsync } from "del";
const { src, dest, watch, series, parallel } = gulp;

//packages for CSS
import gulpSass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";
import * as sass from "sass";
const scss = gulpSass(sass);

//packages for JS
import terser from "gulp-terser";

// packages for HTML
import browserSync from "browser-sync";
const server = browserSync.create();

// packages for images
import imagemin from "gulp-imagemin";
import gifsicle from "imagemin-gifsicle";
import mozjpeg from "imagemin-mozjpeg";
import optipng from "imagemin-optipng";
import svgo from "imagemin-svgo";

function serve() {
  server.init({
    server: {
      baseDir: "app",
    },
    notify: false,
  });
}

function reload(done) {
  server.reload();
  done();
}

function styles() {
  console.log("Compiling styles...");
  return src("app/scss/style.scss")
    .pipe(sourcemaps.init())
    .pipe(scss({ outputStyle: "compressed" }).on("error", scss.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: [
          "last 10 versions",
          // "not dead",
          "> 0.5%",
          "IE 11",
        ],
      })
    )
    .pipe(concat("style.min.css"))
    .pipe(sourcemaps.write())
    .pipe(dest("app/css"))
    .pipe(server.stream());
}

function scripts() {
  console.log("Compiling scripts...");
  return src(["node_modules/jquery/dist/jquery.js", "app/js/main.js"])
    .pipe(concat("main.min.js"))
    .pipe(
      terser().on("error", function (err) {
        console.log(err.toString());
      })
    )
    .pipe(dest("app/js"))
    .pipe(server.stream());
}

function images() {
  return src("app/images/**/*.*")
    .pipe(
      imagemin([
        gifsicle({ interlaced: true }),
        mozjpeg({ quality: 75, progressive: true }),
        optipng({ optimizationLevel: 5 }),
        svgo({
          plugins: [
            {
              name: "removeViewBox",
              active: true,
            },
            {
              name: "cleanupIDs",
              active: false,
            },
          ],
        }),
      ])
    )
    .pipe(gulp.dest("dist/images"));
}

// function htmlLoad() {
//   return src("app/index.html").pipe(dest("dist"));
// }

function buildDist() {
  return src(["app/**/*.html", "app/css/style.min.css", "app/js/main.min.js"], {
    base: "app",
  }).pipe(dest("dist"));
}

function cleanDist() {
  return deleteAsync("dist");
}

function watching() {
  watch("app/**/*.html").on("change", series(reload));
  watch("app/scss/**/*.scss", styles);
  watch("app/images/**/*", images);
  watch("app/js/**/*.js", scripts);
}

export const build = series(cleanDist, images, buildDist);
export const start = parallel(styles, scripts, serve, watching);
