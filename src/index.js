"use strict";

var Firebase = require( "firebase" );
var express = require( "express" );
var cors = require( "cors" );
var app = express();
var bodyParser = require( "body-parser" );
var Log = require( "log" );
var config = require( "./config.js" );
var ref = new Firebase( config.FIREBASE );
var path = require( "path" );
var log = new Log( "debug" );
var corsOptions = {
  origin: require( "./commons/origin.js" )( config.ORIGIN ),
  credentials: true
};
app.options( "*", cors( corsOptions ) );
app.use( cors( corsOptions ) );
log.debug( "Configuring server" );
app.use( bodyParser.urlencoded( {
  extended: true
} ) );
app.use( bodyParser.json( {limit: "10mb"} ) );
/***************** ROUTER **********************/
var middleware = require( "./login/middleware.js" );
var isAuthorized = middleware.isAuthorized;

var loginGoogle = require( "./login/google.js" );
app.use( "/api/login", loginGoogle );

var loginOdoo = require( "./login/odoo.js" );
app.use( "/api/login", loginOdoo );

var users = require( "./routes/user.js" );
app.use( "/api/user", isAuthorized, users );

var roles = require( "./routes/role.js" );
app.use( "/api/role", isAuthorized, roles );

var files = require( "./routes/file.js" );
app.use( "/api/file", files );

var emails = require( "./email/emailRoutes.js" );
app.use( "/api/email", emails );

var customer = require( "./routes/customer.js" );
app.use( "/api/customer", customer );

var paypal = require( "./routes/paypal.js" );
app.use( "/api/paypal", paypal );

app.get( "/", function( req, res ) {
  return res.status( 200 ).end( "API is working correctly" );
} );
/****************        Reports      ********************/

var report = require( "./reports/reportsRoutes.js" );
app.use( "/api/reports", report ); //isAuthorized

/**************** Static routes *************************/

app.use( "/static", express.static( path.resolve( __dirname, "../reports" ) ) );

/**************** Global routes  **********************/

app.use( function( req, res ) {
  res.status( 404 ).send( "Resource not found." );
} );

app.use( function( err, req, res ) {
  console.error( err.stack );
  res.status( 500 ).send( "Server error" );
} );

/****************  Start server *************/

var port = config.PORT;
app.listen( port );
app.on( "connection", function( socket ) {
  console.log( "A new connection was made by a client." );
  socket.setTimeout( 60 * 1000 );

  // 30 second timeout. Change this as you see fit.
} );
log.info( "Server running on port", port );
ref.authWithPassword( {
  email: "daemon@firelab.com",
  password: "daemonfire"
}, function( error ) {
  if ( error ) {
    log.error( "Firebase login failed" );
  } else {
    log.info( "Firebase session stared" );
    require( "./daemon/emailSchedule.js" )();
  }
} );
module.exports = app;
