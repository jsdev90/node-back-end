"use strict";
var App = angular.module( "App", [] );
App.controller( "ReportCtrl", function( $scope, $http ) {
  $http.get( "./data.json" )
       .then( function( res ) {
          $scope.data = res.data;
        } );
  $scope.date = new Date();
  $scope.format = format;
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
} );
