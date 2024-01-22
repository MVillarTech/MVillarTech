/* function tarea(done) {
    console.log('mi primera tarea')

    done();
}

exports.tarea = tarea; */ 

const {src, dest, watch, parallel} = require('gulp');  // Extrae el gulp del package.json 

// CSS 
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// Imagenes 
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// JS 

const terser = require('gulp-terser-js');

function css(done) {
    // Hay que hacer 3 pasos: 1. Identificar el archivo SASS en el package.json -> SRC  2. Compilarlo  3. Almacenarla en el disco duro -> Dest 

    src('src/scss/**/*.scss') // Identifica
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass()) // Compila
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css')) // Almacena


    done(); // Callback que avisa a gulp cuando llegamos al final 
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function versionWebp(done) {

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'))

    done();
}

function versionAvif(done) {

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'))

    done();
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);

    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);