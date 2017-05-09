"use strict";

var mapType = {
  "Monthly": "M",
  "Quarterly": "Q",
  "Semi-annual": "S",
  "Annual": "A",
  "3 year": "3",
  "5 year": "5",
  "Other": "O"
};
var App = angular.module( "App", [] );
App.controller( "ReportCtrl", function( $scope, $http ) {
  $http.get( "./data.json" )
       .then( function( res ) {
          $scope.data = res.data;
        } );
  $scope.date = new Date();
  $scope.format = format;
  $scope.validate = validate;
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

  function validate( typeList ) {
    return _.includes( typeList, mapType[$scope.data.frequency] );
  }
} );
