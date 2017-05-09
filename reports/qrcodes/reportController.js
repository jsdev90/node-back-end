"use strict";
var App = angular.module( "App", [ "ja.qr" ] );

App.controller( "ReportCtrl", function( $scope, $http ) {
  $http.get( "./data.json" )
    .then( function( res ) {
      $scope.data = group( group( res.data, 8 ), 10 );
    } );
} );

function group( codes, ammount ) {
  var group = [];
  while ( codes.length > 0 ) {
    group.push( codes.splice( 0, ammount ) );
  }
  return group;
}
