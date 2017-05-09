"use strict";
var App = angular.module( "App", [] );
var devices = [
  "AHU Shutdown",
  "Beam Detector",
  "Bell",
  "Door Holder",
  "Door Lock",
  "Duct Detector",
  "Elevator Recall",
  "Fire/Smoke Dampers",
  "Fire Phone",
  "Fire Phone Jack",
  "Heat Detector",
  "Horn",
  "Horn/Strobe",
  "Pull Station",
  "Smoke Detector",
  "Speaker",
  "Strobe",
  "Tamper/Supervisory Indicator",
  "Vertical Roll Down Door",
  "WAN Door",
  "Water Flow Alarm",
  "Other"
];
App.controller( "ReportCtrl", function( $scope, $http ) {
  $http.get( "./data.json" )
    .then( function( res ) {
      $scope.data = res.data;
      $scope.groupedDevices = groupDevices( res.data.devices );
      $scope.unusedDevices = getUnusedDevices( res.data.devices );
    } );
  $scope.date = new Date();
  $scope.format = format;
  $scope.formatDate = formatDate;

  function groupDevices( devices ) {
    var withType = _.groupBy( devices, "type" );
    if ( withType.Other ) {
      var withTypeOther = _.groupBy( withType.Other, "typeOther" );
      delete withType.Other;
      return _.merge( withType, withTypeOther );
    }
    return withType;
  }

  function format( number, decimals ) {
    if ( !decimals ) {
      decimals = 3;
    }
    return accounting.formatMoney( accounting.unformat( number ), "", decimals, " ", "," );
  }

  function formatDate( pDate ) {
    if ( !pDate ) {
      return "-----";
    }
    return moment( pDate ).format( "DD/MM/YYYY" );
  }

  function getUnusedDevices( currentDevices ) {
    var group = _.groupBy( currentDevices, "type" );
    var keys = _.keys( group );
    return _.difference( devices, keys );
  }
} );
