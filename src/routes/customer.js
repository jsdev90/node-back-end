"use strict";

var express = require( "express" );
var _ = require( "lodash" );
var router = express.Router();
var Firebase = require( "firebase" );
var config = require( "../config.js" );

function createCustomers( req, res ) {
  var customersRef = new Firebase( config.FIREBASE + req.body.uid );
  _.forEach( req.body.customers, function( customer ) {
    customersRef.push().set( customer.fb );
  } );
  res.status( 200 ).end();
}

router.post( "/", createCustomers );

module.exports = router;
