"use strict";

var express = require( "express" );

//var Log = require("log");
var Comun = require( "../commons/db.js" );

var router = express.Router();
var MODELO = require( "../modelos/ARCHIVO.js" ).modelo;

var comun = new Comun( MODELO );

//var log = new Log("debug");
// -----------------------------------------------------------------------con ID
router.post( "/:id", postID );
router.get( "/:id", getID );
router.put( "/:id", putID );
router.delete( "/:id", deleteID );

// ---------------------------------------------------------------------  sin ID

router.post( "/", postBase );
router.get( "/", getBase );

//-------------------------------------------------------  Definiciones -------/

function postID( req, res ) {
  var curry = comun.findOne( req, res );
  curry( function( res ) {
    return res.status( 409 ).end();
  } );
}

function getID( req, res ) {
  var curry = comun.findOne( req, res );
  curry( function( res, obj ) {
    return res.json( obj );
  } );
}

function putID( req, res ) {
  var curry = comun.findOneAndUpdate( req, res );
  curry();
}

function deleteID( req, res ) {
  var id = req.params.id;
  var opciones = {multi: false, upsert: false};
  MODELO.update( {"_id": id}, {"$set": {"borrado": true}}, opciones, function( err ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    return res.status( 200 ).end();
  } );
}

function postBase( req, res ) {
  MODELO.create( req.body, function( err, obj ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    return res.json( obj );
  } );
}

function getBase( req, res ) {
  var cond = {"borrado": false};
  var abs = comun.skipLimitABS( req.query );
  var query = MODELO.find( cond, null, {} ).skip( abs.total ).limit( abs.cantidad );
  query.exec( function( err, docs ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    comun.contar( res, MODELO.count( cond ), docs );
  } );
}

module.exports = router;
