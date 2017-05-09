"use strict";
var Log = require( "log" );
var mongoose = require( "mongoose" );

var log = new Log( "debug" );
mongoose.connect( require( "./config.js" ).MONGO_URI );

var db = mongoose.connection;
db.on( "error", function( error ) {
  log.error( "Connection error:" + error );
} );
db.once( "open", function() {
  log.info( "Connection stablished" );
} );

module.exports = db;
