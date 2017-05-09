"use strict";

var request = require( "supertest" );
var token = require( "../token.js" );
var MODELO = require( "../../src/modelos/ARCHIVO.js" ).modelo;
var _ = require( "lodash" );

describe( "Rutas del módulo MODELO", function() {
  this.timeout( 15000 );
  var server;
  beforeEach( function() {
    server = require( "../../src/index.js" );
  } );

  it( "Responde 401 cuando el pedido no está autenticado", noAuth );
  it( "Responde a get /api/ARCHIVO/", respuestaGet );
  it( "Responde a post /api/ARCHIVO/ con el objeto creado", postBase );
  it( "Responde a delete /api/ARCHIVO/:id con el obj marcado como borrado", borrar );
  it( "Responde a get /api/ARCHIVO/:id con el obj", obtenerUno );
  it( "Responde a put /api/ARCHIVO/:id con el obj modificado", actualizar );

  function noAuth( done ) {
    request( server )
      .get( "/api/ARCHIVO" )
      .expect( 401, done );
  }

  function respuestaGet( done ) {
    request( server )
      .get( "/api/ARCHIVO" )
      .set( "Authorization", token )
      .expect( 200 )
      .expect( verificarLista )
      .end( finalizarLista( done ) );
  }

  function postBase( done ) {
    var temp = new MODELO( {nombre: "Objeto de MODELO"} );
    request( server )
      .post( "/api/ARCHIVO" )
      .send( temp )
      .set( "Authorization", token )
      .expect( verificarPost )
      .end( finalizar( done, temp._id.toString() ) );
  }

  function borrar( done ) {
    var temp = new MODELO( {nombre: "Objeto a borrar"} );
    temp.save( function test() {
      request( server )
        .delete( "/api/ARCHIVO/" + temp._id )
        .set( "Authorization", token )
        .expect( verificarDelete )
        .end( finalizar( done, temp._id.toString() ) );
    } );
  }

  function obtenerUno( done ) {
    var temp = new MODELO( {nombre: "Objeto a obtener"} );
    temp.save( function test() {
      request( server )
        .get( "/api/ARCHIVO/" + temp._id )
        .set( "Authorization", token )
        .expect( 200 )
        .expect( verificarGet( temp ) )
        .end( finalizar( done, temp._id.toString() ) );
    } );
  }

  function actualizar( done ) {
    var temp = new MODELO( {nombre: "Objeto a obtener"} );
    var nuevo = {nombre: "Otro", _id: temp._id};
    temp.save( function test() {
      request( server )
        .put( "/api/ARCHIVO/" + temp._id )
        .send( nuevo )
        .set( "Authorization", token )
        .expect( 200 )
        .expect( verificarUpdate )
        .end( finalizar( done, temp._id.toString() ) );
    } );
  }
} );

function verificarLista( res ) {
  if ( _.isUndefined( res.body.contador ) || _.isUndefined( res.body.docs ) ) {
    throw new Error( "Respuesta incorrecta del listado" );
  }
}

function verificarUpdate( res ) {
  if ( res.body.nombre !== "Otro" ) {
    throw new Error( "El nombre no fue actualizado" );
  }
}

function verificarGet( obj ) {
  return function interna( res ) {
    if ( res.body._id.toString() !== obj._id.toString() ) {
      throw new Error( "El id no es igual" );
    }
  };
}

function verificarPost( res ) {
  if ( !res.body._id ) {
    throw new Error( "El obj no trae un id" );
  }
  if ( res.status !== 200 ) {
    throw new Error( "La respuesta no fue un 200" );
  }
}

function verificarDelete( res ) {
  if ( res.status !== 200 ) {
    throw new Error( "La respuesta no fue un 200" );
  }
}

function finalizar( done, id ) {
  return function finalizarInterna( err ) {
    MODELO.remove( {"_id": id}, function() {
      if ( err ) {
        return done( err );
      }
      return done();
    } );
  };
}

function finalizarLista( done ) {
  return function finalizarInterna( err ) {
    if ( err ) {
      return done( err );
    }
    return done();
  };
}
