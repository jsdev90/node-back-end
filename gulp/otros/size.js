"use strict";

var gulp = require( "gulp" );
var size = require( "gulp-size" );
var rutas = require( "../rutas" );
var notify = require( "gulp-notify" );
var _ = require( "lodash" );

module.exports = scripts;

function scripts() {
  var todas = [ rutas.scripts.principal ];
  todas = _.union( rutas.scripts.watch, [] );
  var s = size( {showFiles: true} );
  return gulp.src( todas )
    .pipe( s )
    .pipe( notify( {
      onLast: true,
      message: function() {
        return "Tamaño total " + s.prettySize;
      }
    } ) );
}
