"use strict";

//var Log = require( "log" );
//var log = new Log( "debug" );
var express = require( "express" );
var router = express.Router();
var ipn = require( "paypal-ipn" );
var Firebase = require( "firebase" );
var config = require( "../config.js" );
var clientRef = new Firebase( config.FIREBASE ).child( "Clients" );
var moment = require( "moment" );

router.post( "/", function( req, res ) {
  ipn.verify( req.body, {"allow_sandbox": true}, function( err ) {
    if ( err ) {
      return res.status( 500 ).send( err );
    }
    if ( req.body.payment_status === "Completed" || req.body.payment_status === "Pending" ) {
      var expiresOn = getNextPaymentDate( req.body.payment_date );
      clientRef.child( req.body.custom ).child( "expiresOn" ).set( expiresOn );
      clientRef.child( req.body.custom ).child( "deactivated" ).set( false );
      clientRef.child( req.body.custom ).child( "trial" ).set( false );
    }
    return res.end();
  } );
} );

/*Next payment date is calculated according to the billing cycles used by PayPal
https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/subscription_billing_cycles/
*/
function getNextPaymentDate( date ) {
  var payday = moment( new Date( date ) );
  var nextPayday = moment( payday ).add( 1, "month" );
  nextPayday.set( "hour", 23 ).set( "minute", 59 ).set( "second", 59 );
  if ( payday.date() !== nextPayday.date() ) {
    return nextPayday.add( 1, "day" ).format();
  }
  return nextPayday.format();
}

module.exports = router;
