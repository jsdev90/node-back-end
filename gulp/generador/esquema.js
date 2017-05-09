"use strict";

var mongoose = require( "mongoose" );
var esquema = new mongoose.Schema( {
  nombre: {
    type: String,
    default: "Nombre"
  },
  borrado: { type: Boolean, default: false, select: false, index: true }
} );

var modelo = mongoose.model( "MODELO", esquema );

exports.esquema = esquema;
exports.modelo = modelo;
