"use strict";

var express = require( "express" );
var fs = require( "fs" );
var path = require( "path" );
var multiparty = require( "multiparty" );
var router = express.Router();

router.post( "/", uploadImage );
router.get( "/:filename", getImage );
router.delete( "/:filename", deleteImage );

function uploadImage( req, res ) {
  var form = new multiparty.Form();
  form.parse( req, function( err, fields, files ) {
    if ( err ) {
      return res.send( err );
    }
    var img = files.file[0];
    fs.readFile( img.path, function( err, data ) {
      var dir = path.resolve( __dirname, "../../reports/uploads/" );
      if ( !fs.existsSync( dir ) ) {
        fs.mkdirSync( dir );
      }
      var dest = path.resolve( __dirname, "../../reports/uploads/" + img.originalFilename );
      fs.writeFile( dest, data, function( error ) {
        if ( error ) {
          return res.send( error );
        }
        return res.send( new Buffer( data ).toString( "base64" ) );
      } );
    } );
  } );
}

function getImage( req, res ) {
  var src = path.resolve( __dirname, "../../reports/uploads/" + req.params.filename );
  fs.readFile( src, {encoding: "base64"}, function( err, data ) {
    if ( err ) {
      return res.send( err );
    }
    return res.send( data );
  } );
}

function deleteImage( req, res ) {
  var src = path.resolve( __dirname, "../../reports/uploads/" + req.params.filename );
  fs.unlink( src, function( err ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    return res.send( {success: true} );
  } );
}

module.exports = router;
