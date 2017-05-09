"use strict";

var gulp = require( "gulp" );
var sloc = require( "gulp-sloc" );
var rutas = require( "../rutas" );
var _ = require( "lodash" );

module.exports = scripts;

function scripts() {
  var todas = [ rutas.scripts.principal ];
  todas = _.union( rutas.scripts.watch, [] );
  return gulp.src( todas )
    .pipe( sloc() );
}
