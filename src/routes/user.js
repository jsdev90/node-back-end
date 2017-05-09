"use strict";

var express = require( "express" );

//var Log = require("log");
var _ = require( "lodash" );

//var log = new Log("debug");

var router = express.Router();
var User = require( "../models/user.js" );

function one( res ) {
  return function( id ) {
    User.findOne( {"_id": id}, function( err, obj ) {
      if ( err ) {
        return res.status( 500 ).send( err );
      }
      if ( _.isEmpty( obj ) ) {
        return res.status( 404 ).end();
      }
      return res.json( obj );
    } );
  };
}

router.get( "/me", function( req, res ) {
  one( res )( req.User );
} );

router.get( "/:id", function( req, res ) {
  one( res )( req.params.id );
} );

router.get( "/search/", function( req, res ) {
  var query = {name: {"$regex": req.query.text, $options: "i"}};
  var params = {skip: req.query.page, limit: req.query.qty};
  User.find( query, null, params, function( err, obj ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    return res.json( obj );
  } );
} );

router.get( "/", function( req, res ) {
  User.find( function( err, obj ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    return res.json( obj );
  } );
} );

router.put( "/:id", function( req, res ) {
  var id = req.params.id;
  var options = {
    multi: false,
    upsert: false
  };
  User.findOneAndUpdate( {
    "_id": id
  }, req.body, options, function( err, obj ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    if ( _.isEmpty( obj ) ) {
      return res.status( 404 ).end();
    }
    return res.json( obj );
  } );
} );

module.exports = router;
