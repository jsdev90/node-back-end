"use strict";

var expect = require( "chai" ).expect;
var origin = require( "../../src/commons/origin.js" );

describe( "Origin functions", function() {

  it( "Returns 1 string when receiving an string", singleResponse );
  it( "Returns an string arrays when receiving an string separated by commas", arrayResponse );

  function singleResponse() {
    var string = "http://ciriscr.com";
    expect( origin( string ) ).to.equal( string );
  }

  function arrayResponse() {
    var string = "http://ciriscr.com, http://galeniscr.com";
    var resp = [ "http://ciriscr.com", "http://galeniscr.com" ];
    expect( origin( string ) ).to.eql( resp );
  }
} );
