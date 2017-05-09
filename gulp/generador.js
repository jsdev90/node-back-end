"use strict";

var fs = require( "fs" );

module.exports = generador;

function generador() {
  var esquema = fs.readFileSync( "gulp/generador/esquema.js", "utf-8" );
  var ruta = fs.readFileSync( "gulp/generador/rutas.js", "utf-8" );
  var tests = fs.readFileSync( "gulp/generador/tests.js", "utf-8" );

  try {
    var modulo  = require( "yargs" ).argv.modulo;
    var esquemaNuevo = esquema.replace( /\bMODELO\b/g, modulo );
    var rutaNuevo = ruta.replace( /\bMODELO\b/g, modulo )
      .replace( /\bARCHIVO\b/g, modulo.toLowerCase() );
    var testsNuevo = tests.replace( /\bMODELO\b/g, modulo )
      .replace( /\bARCHIVO\b/g, modulo.toLowerCase() );
    fs.writeFileSync( "src/modelos/" + modulo.toLowerCase() + ".js", esquemaNuevo, "utf-8" );
    fs.writeFileSync( "src/rutas/" + modulo.toLowerCase() + ".js", rutaNuevo, "utf-8" );
    fs.writeFileSync( "test/rutas/" + modulo.toLowerCase() + ".js", testsNuevo, "utf-8" );

    console.log( "Módulo completado. Recuerde agregar las rutas a src/index.js" );
  } catch ( es ) {
    console.log( es );
    console.log( "Se debe especificar el parámetros --modulo" );
  }

}
