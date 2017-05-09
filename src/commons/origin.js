"use strict";
var _ = require( "lodash" );
module.exports = function origin( string ) {
  var res = string.split( "," );
  if ( _.size( res ) === 1 ) {
    return string;
  }
  return _.map( res, function( s ) {
    return s.trim();
  } );
};
