"use strict";

var gulp = require( "gulp" );

gulp.task( "js:hint", require( "./jshint" ) );
gulp.task( "js:inspect", require( "./inspect" ) );
gulp.task( "js:complexity", require( "./complexity.js" ) );
gulp.task( "js:cs", require( "./jscs.js" ) );
gulp.task( "js:qa", [ "js:hint", "js:cs", "js:complexity", "js:inspect" ],
  function( cb ) {
    return cb();
  }
);
