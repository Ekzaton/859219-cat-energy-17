"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");
var del = require("del");
var server = require("browser-sync").create();

//Оптимизация CSS
gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

//Оптимизация изображений
gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"));
});

//Создание .webp из .png и .jpg
gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("source/img"));
});

//Создание .svg-спрайта из отдельных .svg
gulp.task("sprite", function () {
  return gulp.src("source/img/{htmlacademy.svg,icon-*.svg}")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

//Оптимизация HTML
gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(htmlmin())
    .pipe(gulp.dest("build"));
});

//Оптимизация JS
gulp.task("js", function () {
  return gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest("build/js"));
});

//Копирование шрифтов и изображений в папку сборки проекта
gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

//Удаление всех файлов из папки сборки проекта
gulp.task("clean", function () {
  return del("build");
});

//Запуск сервера
gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/{htmlacademy.svg,icon-*.svg}", gulp.series("sprite", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

//Перезапуск сервера
gulp.task("refresh", function (done) {
  server.reload();
  done();
});

//Сборка проекта
gulp.task("build", gulp.series("clean", "copy", "css", "sprite", "html", "js"));

//Сборка проекта и запуск сервера
gulp.task("start", gulp.series("build", "server"));
