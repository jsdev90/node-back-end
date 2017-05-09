"use strict";

var gulp = require( "gulp" );
var jshint = require( "gulp-jshint" );
var routes = require( "../rutas.js" );
var gutil = require( "gulp-util" );

module.exports = jsHint;

function jsHint() {
  return gulp.src( routes.scripts.watch )
    .pipe( jshint() )
    .pipe( jshint.reporter( "jshint-stylish" ) )
    .on( "error", gutil.log );
}
