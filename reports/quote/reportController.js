"use strict";
var App = angular.module( "App", [] );

var factura = Object.create( null );
factura.materialsSubtotal  = materialsSubtotal;
factura.laborSubtotal  = laborSubtotal;
factura.tax  = tax;
factura.total  = total;

App.filter( "percentage", [ "$filter", function( $filter ) {
  return function( input ) {
    return $filter( "number" )( input * 100, 2 ) + "%";
  };
} ] );

App.controller( "ReportCtrl", function( $scope, $http ) {
  $http.get( "./data.json" )
    .then( function( res ) {
      $scope.data = _.assign( res.data, factura );
      $scope.padding = calculatePadding( getRows( res.data ) );
    } );
  $scope.date = new Date();
  $scope.format = format;
  $scope.formatDate = formatDate;

  function format( number, decimals ) {
    return accounting.formatMoney( accounting.unformat( number ), "", decimals || 2, " ", "," );
  }

  function formatDate( pDate ) {
    if ( !pDate ) {
      return "-----";
    }
    return moment( pDate ).format( "DD/MM/YYYY" );
  }

  function getRows( data ) {
    return data.works ? data.works.length : 0;
  }

  function calculatePadding( rows ) {
    var temp = [];
    for ( var i = 1; i <= 21 - rows; i += 1 ) {
      temp.push( i );
    }
    return temp;
  }
} );

function categorySubtotal( obj, func ) {
  var filtered = _[func]( obj, function( work ) {
    return work.isLabor;
  } );
  return _.reduce( filtered, function( total, work ) {
    return total + ( work.quantity * work.price );
  }, 0 );
}

function materialsSubtotal() {
  return categorySubtotal( this.works, "reject" );
}

function laborSubtotal() {
  return categorySubtotal( this.works, "filter" );
}

function tax() {
  return this.taxPercentage * this.materialsSubtotal();
}

function total() {
  return this.tax() + this.laborSubtotal() + this.materialsSubtotal();
}
