"use strict";

var express = require( "express" );
var config = require( "../config.js" );
var middleware = require( "./middleware.js" );
var User = require( "../models/user.js" );
var http = require( "http" );
var router = express.Router();
var Log = require( "log" );
var log = new Log( "debug" );
var _ = require( "lodash" );

router.post( "/odoo", function( req, res ) {
  return loginOdoo( req, res );
} );

function options( path, longitud, sessionId ) {
  var headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Content-Length": longitud
  };
  if ( sessionId ) {
    headers.Cookie = "session_id=" + sessionId;
  }
  return {
    host: config.ODOO_HOST,
    port: config.ODOO_PORT,
    path: path,
    method: "POST",
    headers: headers
  };
}

function searchUser( res, finalResponse ) {
  User.findOne( {
    odooId: finalResponse.result.uid
  }, function( err, obj ) {
    if ( obj ) {
      log.debug( "User found" );
      var s = "session_id";
      return res.send( generateResponse( obj, finalResponse.result[s] ) );
    } else {
      log.debug( "First time login. User registered." );
      return newUser( finalResponse.result, res );
    }
  } );
}

function loginOdoo( req, res ) {
  var json = paramsOdoo( req.body.login, req.body.password );
  var opt = options( "/web/session/authenticate", json.length );
  var connect = http.request( opt, function( result ) {
    var odooResponse = "";
    result.setEncoding( "utf8" );
    result.on( "data", function( chunk ) {
      odooResponse += chunk;
    } );
    result.on( "end", function end() {
      var finalResponse = JSON.parse( odooResponse );
      if ( finalResponse.error || !finalResponse.result.uid ) {
        return res.status( 401 ).send( finalResponse );
      }
      searchUser( res, finalResponse );
    } );
  } );
  connect.write( json );
}

function newUser( loginResult, res ) {
  var json = paramsUser( loginResult.uid );
  var s = "session_id";
  var opt = options( "/web/dataset/call_kw", json.length, loginResult[s] );
  var consultUser = http.request( opt, function( result ) {
    var response = "";
    result.setEncoding( "utf8" );
    result.on( "data", function( chunk ) {
      response += chunk;
    } );

    result.on( "end", function() {
      var finalResponse = JSON.parse( response );
      var odooUser = finalResponse.result;
      var user = new User();
      var i = "image_small";
      user.name = odooUser.name;
      user.email = loginResult.username;
      user.odooId = odooUser.id;
      user.picture = odooUser[i];

      User.find( {} ).exec().then( function( obj ) {
        if ( !obj.length ) {
          user.role = "Administrator";
          _.forEach( user.permissions.toObject(), function( permission ) {
            _.forEach( permission, function( v, action ) {
              permission[action] = true;
            } );
          } );
        }
        user.save( function() {
          return res.send( generateResponse( user, loginResult[s] ) );
        } );
      } );
    } );
  } );
  consultUser.write( json );
}

function generateResponse( user, sesionOdoo ) {
  function resp() {
    return {
      name: user.name,
      picture: user.picture,
      sesionOdoo: sesionOdoo,
      token: token,
      state: user.state,
      role: user.role,
      permissions: user.permissions
    };
  }
  var token = middleware.createJWT( user );
  return {
    token: token,
    user: resp()
  };
}

function paramsOdoo( login, pass ) {
  var obj = {
    db: config.ODOO_DB,
    login: login,
    password: pass
  };

  return JSON.stringify( {
    params: obj
  } );
}

function paramsUser( uid ) {
  var obj = {
    "model": "res.users",
    "method": "read",
    "args": [ uid, [ "name", "image_small" ] ],
    "kwargs": {}
  };
  return JSON.stringify( {
    params: obj
  } );
}

module.exports = router;
