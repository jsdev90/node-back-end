"use strict";

var _ = require( "lodash" );
var config = require( "../config.js" );
var Firebase = require( "firebase" );
var Log = require( "log" );
var log = new Log( "debug" );
var moment = require( "moment" );
var path = require( "path" );
var ref = new Firebase( "https://firelab-dev.firebaseio.com" );
var ses = require( "../aws.js" ).ses;
var swig = require( "swig" );
var contentMap = require( "./contentMap.js" );

function checkDates() {
  ref.child( "Clients" ).once( "value", function( snapshot ) {
    _.forEach( snapshot.val(), function( client, idClient ) {
      if ( client.deactivated ) { return; }
      if ( client.freeExpDate ) {
        if ( moment( client.freeExpDate ).isBefore( moment().startOf( "day" ) ) ) {
          return suspendAccount( client, idClient );
        }
      } else {
        if ( client.deactivationDate ) {
          if ( moment( client.deactivationDate ).isBefore( moment().startOf( "day" ) ) ) {
            return suspendAccount( client, idClient );
          }
        }
        if ( client.trial ) {
          return remainingDays( client, idClient );
        }
        var afterExpiration = moment( client.expiresOn ).add( 1, "day" ).format( "YYYY-MM-DD" );
        if ( afterExpiration === moment().format( "YYYY-MM-DD" ) ) {
          return sendEmail( "GRACE_PERIOD", client.email, "Grace Period", {} );
        }
        var today = moment().format();
        var gracePeriod = moment( client.expiresOn ).add( 7, "day" );
        if ( gracePeriod.isBefore( today ) ) {
          suspendAccount( client, idClient );
        }
      }
    } );
  } );
}

function remainingDays( client, idClient ) {
  var diff = moment().diff( moment( client.subscribedOn ), "day" );
  if ( diff > 30 ) {
    suspendAccount( client, idClient );
  }
  if ( diff === 30 ) {
    sendEmail( "USER_ACCOUNT", client.email, "Free Trial Ends Today", contentMap.trialEnds );
  }
  if ( diff === 27 ) {
    sendEmail( "USER_ACCOUNT", client.email, "3 Day Notice", contentMap.threeDayNotice );
  }
}

function sendEmail( type, destination, subject, content ) {
  var template = path.resolve( __dirname, "../email/html/" + type + ".html" );
  swig.renderFile( template, {content: content}, function( err, output ) {
    if ( err ) {
      log.error( "Email template not found" );
    }
    var params = {
      Destination: { ToAddresses: [ destination ] },
      Message: {
        Body: {
          Html: { Charset: "UTF-8", Data: output }
        },
        Subject: { Data: subject, Charset: "UTF-8" }
      },
      Source: config.NOTIFICATION_EMAIL
    };
    ses.sendEmail( params, function( err ) {
      log.info( "Sending email...", params );
      if ( err ) {
        log.error( err );
      } else {
        log.info( "Email sent succesfully" );
      }
    } );
  } );
}

function suspendAccount( client, idClient ) {
  ref.child( "Clients" ).child( idClient ).child( "deactivated" ).set( true );
  sendEmail( "USER_ACCOUNT", client.email, "Account Status", contentMap.accountSuspended );
  log.info( "Account suspended" );
}

module.exports = checkDates;
