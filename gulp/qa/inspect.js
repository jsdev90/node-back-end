"use strict";

var gulp = require( "gulp" );
var jsinspect = require( "gulp-jsinspect" );
var routes = require( "../rutas.js" );
var gutil = require( "gulp-util" );

module.exports = inspect;

function inspect() {
  return gulp.src( routes.scripts.watch )
    .pipe( jsinspect( {
      "threshold": 35,
      "identifiers": true,
      "suppress": 100
    } ) )
    .on( "error", gutil.log );
}
