"use strict";

var express = require( "express" );
var Log = require( "log" );
var config = require( "../config.js" );
var request = require( "request" );
var jwt = require( "jwt-simple" );
var middleware = require( "./middleware.js" );
var User = require( "../models/user.js" );
var log = new Log( "debug" );
var router = express.Router();

function userResult( res, profile ) {
  return function res( err, user ) {
    if ( !user ) {
      return res.status( 500 ).send( { message: "The user does not exist" } );
    }
    setUser( user );
  };
  function setUser( user ) {
    user.google = profile.sub;
    user.picture = user.picture || profile.picture.replace( "sz=50", "sz=200" );
    user.displayName = user.displayName || profile.name;
    user.save( function() {
      var token = middleware.createJWT( user );
      res.send( { token: token } );
    } );
  }
}

router.post( "/google", function( req, res ) {
  log.debug( "Logged with Google" );
  var accessTokenUrl = "https://accounts.google.com/o/oauth2/token";
  var peopleApiUrl = "https://www.googleapis.com/plus/v1/people/me/openIdConnect";
  var params = {
    code: req.body.code,
    "client_id": req.body.clientId,
    "client_secret": config.GOOGLE_SECRET,
    "redirect_uri": req.body.redirectUri,
    "grant_type": "authorization_code"
  };

  // Step 1. Exchange authorization code for access token.
  request.post( accessTokenUrl, { json: true, form: params }, function( err, response, token ) {
    var s = "access_token";
    var headers = { Authorization: "Bearer " + token[s] };

    // Step 2. Retrieve profile information about the current user.
    var query = { url: peopleApiUrl, headers: headers, json: true };
    request.get( query, function( err, response, profile ) {
      if ( profile.error ) {
        return res.status( 500 ).send( {message: profile.error.message} );
      }

      // Step 3a. Link user accounts.
      if ( req.headers.authorization ) {
        User.findOne( { google: profile.sub }, function( err, existingUser ) {
          if ( existingUser ) {
            var resp = { message: "There is already a Google account that belongs to you" };
            return res.status( 409 ).send( resp );
          }
          var token = req.headers.authorization.split( " " )[1];
          var payload = jwt.decode( token, config.TOKEN_SECRET );
          User.findById( payload.sub, userResult );
        } );
      } else {

        // Step 3b. Create a new user account or return an existing one.
        User.findOne( { google: profile.sub }, function( err, obj ) {

          if ( obj ) {
            return res.send( { token: middleware.createJWT( obj ) } );
          }
          var user = new User();
          user.google = profile.sub;
          user.picture = profile.picture.replace( "sz=50", "sz=200" );
          user.name = profile.name;
          user.email = profile.email;
          user.save( function() {
            var token = middleware.createJWT( user );
            res.send( { token: token } );
          } );
        } );
      }
    } );
  } );
} );

module.exports = router;
