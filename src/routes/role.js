"use strict";

var express = require( "express" );

//var Log = require("log");
var Common = require( "../commons/db.js" );
var _ = require( "lodash" );

var router = express.Router();
var role = require( "../models/role.js" ).model;

role.find( {} ).exec().then( function( obj ) {
  if ( !obj.length ) {
    var admin = new role();
    admin.name = "Administrator";
    admin.description = "Administrator";
    _.forEach( admin.permissions.toObject(), function( permission ) {
      _.forEach( permission, function( v, action ) {
        permission[action] = true;
      } );
    } );
    admin.save();
  }
} );

var common = new Common( role );

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
  var curry = common.findOne( req, res );
  curry( function( res ) {
    return res.status( 409 ).end();
  } );
}

function getID( req, res ) {
  var curry = common.findOne( req, res );
  curry( function( res, obj ) {
    return res.json( obj );
  } );
}

function putID( req, res ) {
  var curry = common.findOneAndUpdate( req, res );
  curry();
}

function deleteID( req, res ) {
  var id = req.params.id;
  var options = {multi: false, upsert: false};
  role.update( {"_id": id}, {"$set": {"deleted": true}}, options, function( err ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    return res.status( 200 ).end();
  } );
}

function postBase( req, res ) {
  role.create( req.body, function( err, obj ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    return res.json( obj );
  } );
}

function getBase( req, res ) {
  var cond = {"deleted": false};
  var abs = common.skipLimitABS( req.query );
  var query = role.find( cond, null, {} ).skip( abs.total ).limit( abs.qty );
  query.exec( function( err, docs ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    common.count( res, role.count( cond ), docs );
  } );
}

module.exports = router;
