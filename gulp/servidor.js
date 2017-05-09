"use strict";

var nodemon = require( "nodemon" );

module.exports = servidor;

function servidor() {
  return nodemon( {
    script: "src/index.js"
  } );
} //function
