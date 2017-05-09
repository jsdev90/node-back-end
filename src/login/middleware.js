"use strict";
var jwt = require( "jwt-simple" );
var moment = require( "moment" );
var config = require( "../config.js" );

exports.isAuthorized = isAuthorized;
exports.createJWT = createJWT;

function isAuthorized( req, res, next ) {
  if ( !req.headers.authorization ) {
    var resp = "Request does not contain required security header";
    return res.status( 401 ).send( resp );
  }
  validate( req, res );
  next();
}

function validate( req, res ) {
  try {
    var payload = decode( token( req ) );
    if ( payload.exp <= moment().unix() ) {
      return res.status( 401 ).send( "Token expired" );
    }
    req.user = payload.sub;
    req.permissions = payload.permissions;
  } catch ( err ) {
    return res.status( 401 ).send( err.message );
  }
}

function token( req ) {
  return req.headers.authorization.split( " " )[1];
}

function decode( token ) {
  return jwt.decode( token, config.TOKEN_SECRET );
}

function createJWT( user ) {
  var payload = {
    sub: user._id,
    permissions: user.permissions,
    iat: moment().unix(),
    exp: moment().add( 1, "years" ).unix()
  };
  return jwt.encode( payload, config.TOKEN_SECRET );
}
