//* Gulp - менеджер задач и сборщик. Обрабатывает html, css, js файлы, минифицирует и собирает в билд. Преобразовывает scss(препроцессор) в css, добавляет автопрефиксы

const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const csso = require("gulp-csso");
const include = require("gulp-file-include");
const htmlmin = require("gulp-htmlmin");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const sync = require("browser-sync").create();
const del = require("del");

//*Прописываем задачи: склеить части html

function html() {
  return src("src/**.html")
    .pipe(include({ prefix: "@@" }))
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest("dist"));
}
//*Прописываем задачи: преобразовать в css

function scss() {
  return src("src/scss/**.scss")
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(csso())
    .pipe(concat("index.css"))
    .pipe(dest("dist"));
}

function clearDist() {
  return del("dist");
}
// exports.html = html;
// exports.scss = scss;

const serve = () => {
  sync.init({
    server: "./dist",
  });
  watch('src/**.html', series(html)).on("change", sync.reload)
  watch('src/scss/**.scss', series(scss)).on("change", sync.reload)
};

exports.build = series(clearDist, scss, html);
exports.serve = series(clearDist, scss, html, serve)
exports.clearDist = clearDist;
