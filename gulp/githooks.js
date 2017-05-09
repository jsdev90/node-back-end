"use strict";

var fs = require( "fs" );
var execSync = require( "child_process" ).execSync;
var readlineSync = require( "readline-sync" );
var _ = require( "lodash" );

module.exports = githook;
var question = "¿Qué tipo de cambio se hizo? [Mayor, Menor, Parche] (Parche)\n";
function githook( cb ) {
  var tipo = readlineSync.question( question );
  var paquete = readPackage();
  paquete.version = bump( paquete.version, tipo );
  writePackage( paquete );
  execSync( "git add package.json" );
  return cb();
}

function readPackage() {
  return JSON.parse( fs.readFileSync( "package.json", "utf-8" ) );
}

function writePackage( json ) {
  return fs.writeFileSync( "package.json", JSON.stringify( json, null, "  " ) );
}

function bump( version, tipo ) {
  var vers = _.map( version.split( "." ), function( ele ) {
    return ele * 1;
  } );
  if ( /may/i.test( tipo ) ) {
    return ( vers[0] + 1 ) + ".0.0";
  }
  if ( /men/i.test( tipo ) ) {
    return vers[0] + "." + ( vers[1] + 1 ) +  ".0";
  }
  return vers[0] + "." + vers[1] +  "." + ( vers[2] + 1 );
}
