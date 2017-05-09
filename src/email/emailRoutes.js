"use strict";

var express = require( "express" );
var router = express.Router();
var ses = require( "../aws.js" ).ses;
var config = require( "../config.js" );
var _ = require( "lodash" );
var path = require( "path" );
var swig = require( "swig" );

router.post( "/", sendEmail );

function sendEmail( req, res ) {
  var template = getTemplate( req.body.type );
  swig.renderFile( template, ( req.body.content || {} ), function( err, output ) {
    if ( err ) {
      return res.status( 500 ).send( { data: { message: "Email template not found" } } );
    }
    var params = getMailObject( req.body.addresses, output, req.body.subject );
    ses.sendEmail( params, function( err, resp ) {
      if ( err ) {
        return res.status( 500 ).send( err );
      }
      return res.status( 200 ).send( resp );
    } );
  } );
}

function getMailObject( correos, cuerpo, asunto ) {
  return {
    Destination: {
      ToAddresses: _.toArray( correos )
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: cuerpo
        }
      },
      Subject: {
        Data: asunto,
        Charset: "UTF-8"
      }
    },
    Source: config.NOTIFICATION_EMAIL
  };
}

function getTemplate( type ) {
  return path.resolve( __dirname, "../email/html/" + type + ".html" );
}

module.exports = router;
