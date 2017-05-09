"use strict";

var AWS = require( "aws-sdk" );
AWS.config.update( {region: "us-west-2"} );

exports.s3 = new AWS.S3();
exports.ses = new AWS.SES();
