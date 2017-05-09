"use strict";

var gulp = require( "gulp" );
var jscs = require( "gulp-jscs" );
var routes = require( "../rutas.js" );
var gutil = require( "gulp-util" );

module.exports = jscs;

function jscs() {
  return gulp.src( routes.scripts.watch )
    .pipe( jscs( {fix: true} ) )
    .pipe( jscs.reporter() )
    .pipe( gulp.dest( routes.scripts.base ) )
    .on( "error", gutil.log );
}
