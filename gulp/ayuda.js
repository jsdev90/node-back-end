"use strict";

var fs = require( "fs" );
var Log = require( "log" );
var log = new Log( "info" );

module.exports = ayuda;

function ayuda() {
  var readme = fs.readFileSync( "README.md", "utf-8" );
  var textoInicio = string( "INICIO" );
  var inicio = readme.indexOf( textoInicio ) + textoInicio.length;
  var fin = readme.indexOf( string( "FIN" ) );
  log.info( readme.substring( inicio, fin ) );
}

function string( texto ) {
  return "[comment]: <> (COMANDOS:" + texto + ")";
}
