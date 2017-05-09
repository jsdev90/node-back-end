"use strict";

var gulp = require( "gulp" );
var rutas = require( "./rutas" );

module.exports = watch;

function watch() {
  gulp.watch( rutas.scripts.watch, [ ] );
} //function
