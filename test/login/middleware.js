"use strict";

var isAuthorized = require( "../../src/login/middleware.js" ).isAuthorized;
var httpMocks = require( "node-mocks-http" );
var expec = require( "chai" ).expect;

describe( "Is authorized function", function() {

  it( "Request contains required security header", sigueUsuario );
  it( "Request contains an invalid security header", invalid );

  function sigueUsuario() {
    var request = httpMocks.createRequest( {
      method: "GET",
      url: "/",
      headers: {
          authorization: require( "../token.js" )
        }
    } );
    var response = httpMocks.createResponse();
    isAuthorized( request, response, function() {} );
    expec( response.statusCode ).to.equal( 200 );
  }

  function invalid() {
    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImlhdCI6MTQ0OTA3Nzc" +
    "2NSwiZXhwIjozMDI3MDAwOTY1fQ.yH_57waXkQIwIv9_tqv";
    var request = httpMocks.createRequest( {
      method: "GET",
      url: "/",
      headers: {
          authorization: "Bearer " + token
        }
    } );
    var response = httpMocks.createResponse();
    var res = "Signature verification failed";
    isAuthorized( request, response, function() {} );
    expec( response._getData() ).to.equal( res );
    expec( response.statusCode ).to.equal( 401 );
  }
} );
