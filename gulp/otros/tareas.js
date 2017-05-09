"use strict";

var gulp = require( "gulp" );

gulp.task( "util:size", require( "./size" ) );
gulp.task( "util:loc", require( "./loc" ) );
gulp.task( "util", [ "util:size", "util:loc" ], function() {} );
