"use strict";
var App = angular.module( "App", [] );
App.controller( "ReportCtrl", function( $scope, $http ) {
  $http.get( "./data.json" )
       .then( function( res ) {
          $scope.data = res.data;
          $scope.padding = calculatePadding( getRows( res.data ) );
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
    return moment( pDate ).format( "MM/DD/YYYY" );
  }
  function getRows( data ) {
    return data.extinguishers ? data.extinguishers.length : 0;
  }

  function calculatePadding( rows ) {
    var temp = [];
    for ( var i = 1; i <= 16 - rows; i += 1 ) {
      temp.push( i );
    }
    return temp;
  }
} );
