"use strict";

var gulp = require( "gulp" );

require( "./otros/tareas.js" );
require( "./qa/tasks.js" );

gulp.task( "help", require( "./ayuda.js" ) );
gulp.task( "pre-commit", require( "./githooks.js" ) );

gulp.task( "serve", require( "./servidor" ) );
gulp.task( "default", [ "serve" ] );

gulp.task( "generar", require( "./generador.js" ) );
