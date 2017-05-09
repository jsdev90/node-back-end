"use strict";
var App = angular.module( "App", [] );
var devices = [
  "Bell",
  "Horn",
  "Horn/Strobe",
  "Cold Weather Valve",
  "Control Valve",
  "PIV",
  "Supervisory Switch",
  "Water Motor Gong",
  "WIV",
  "Other"
];
var mapType = {
  "Monthly": "M",
  "Quarterly": "Q",
  "Semi-annual": "S",
  "Annual": "A",
  "3 year": "3",
  "5 year": "5",
  "Other": "O"
};
App.controller( "ReportCtrl", function( $scope, $http ) {
  $http.get( "./data.json" )
       .then( function( res ) {
          $scope.data = res.data;
          $scope.unusedDevices = getUnusedDevices( res.data.devices );
          $scope.groupedDevices = groupDevices( res.data.devices );
          $scope.data.risers = _.groupBy( res.data.risers, "type" );
        } );
  $scope.date = new Date();
  $scope.format = format;
  $scope.validate = validate;

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
  $scope.formatDate = formatDate;
  function formatDate( pDate ) {
    if ( !pDate ) {
      return "-----";
    }

    //moment( pDate ).lang("es").format( "LL" )
    return moment( pDate ).format( "DD/MM/YYYY" );
  }
  function getUnusedDevices( currentDevices ) {
    var group = _.groupBy( currentDevices, "type" );
    var keys = _.keys( group );
    return _.difference( devices, keys );
  }
  function validate( typeList ) {
    return _.includes( typeList, mapType[$scope.data.frequency] );
  }
} );
