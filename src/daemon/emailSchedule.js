"use strict";

module.exports = runEmailDaemon;

var crontab = require( "node-crontab" );
var Log = require( "log" );
var log = new Log( "debug" );
var trialChecker = require( "./trialChecker.js" );

function runEmailDaemon() {
  log.info( "Email daemon is running" );
  crontab.scheduleJob( "1 0 * * *", trialChecker ); //runs everyday at 12:01 am
}
