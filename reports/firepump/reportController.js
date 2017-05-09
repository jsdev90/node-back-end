/*global d3*/
"use strict";
var App = angular.module( "App", [ "nvd3" ] );
App.controller( "ReportCtrl", function( $scope, $http, $timeout ) {
  $http.get( "./data.json" )
       .then( function( res ) {
          $scope.data = res.data;
          var temp = _.groupBy( res.data.flowTestArr, "type" );
          $scope.data.flowTestArr = {
            churn: temp["Flow Test - Churn (0%)"],
            rated100: temp["Flow Test - Rated Flow 100%"],
            rated150: temp["Flow Test - Rated Flow 150%"]
          };
          $scope.spRated100 = calculatePadding( getRows( $scope.data, "rated100" ), 6 );
          $scope.spRated150 = calculatePadding( getRows( $scope.data, "rated150" ), 5 );
          var gData = extractPoints( $scope.data );
          $scope.graphData = graphData( gData );
          $scope.options = options( max( gData, "y", 200 ), max( gData, "x", 2500 ) );
          labels();
        } );
  $scope.date = new Date();
  $scope.format = format;

  function max( data, axe, round ) {
    var temp = _.max( [ data[0][2][axe], data[1][2][axe] ] );
    return Math.ceil( temp / round ) * round;
  }

  function labels() {
    $timeout( function() {
      d3.selectAll( ".nv-group path" )[0].forEach( function( d ) {
            var tf = d3.select( d ).attr( "transform" );
            var t = d3.transform( tf ).translate;
            t[1] = Math.ceil( ( t[1] + 15 ) / 10 ) * 10;//moving the translate x by 5 pixel.
            if ( _.isNumber( d3.select( d ).data()[0][1] ) ) {
              var data = d3.select( d ).data()[0][0];
              d3.select( d.parentNode )
                .append( "text" )
                .attr( "class", "graph-text" )
                .text( data.label )
                .attr( "transform", "translate(" + ( t[0] - data.m ) + "," + t[1] + ")" );
            }
          } );
    }, 100 );
  }

  function extractPoints( data ) {
    var pt = data.flowTestArr;
    var a = [
      {x: pt.churn[0].gpm, y: pt.churn[0].dischargePSI, label: "Churn Discharge", m: 0},
      {x: data.capacityGPM, y: pt.rated100[0].dischargePSI, label: "100% Discharge", m: 73},
      {x: data.capacityGPM150, y: pt.rated150[0].dischargePSI, label: "150% Discharge", m: 73}
     ];
    var b = [
      {x: pt.churn[0].gpm, y: pt.churn[0].netPressurePSI, label: "Churn Net Pressure", m: 0},
      {x: data.capacityGPM, y: pt.rated100[0].netPressurePSI, label: "100% Net Pressure", m: 86},
      {x: data.capacityGPM150, y: pt.rated150[0].netPressurePSI, label: "150% Net Pressure", m: 86}
     ];
    return [ a, b ];
  }

  function options( maxYDomain, maxXDomain ) {
    return {
      chart: {
        type: "lineChart",
        height: 730,
        margin: {
          top: 20,
          right: 50,
          bottom: 45,
          left: 50
        },
        width: 755,
        showLegend: false,
        pointSize: 3,
        interative: false,
        showValues: true,
        useInteractiveGuideline: false,
        yDomain: [ 0, maxYDomain ],
        xDomain: [ 0, maxXDomain ],
        xAxis: {
          axisLabel: "Flow Rate (gpm)",
          tickValues: ticks( 2500, 100 )
        },
        yAxis: {
          axisLabel: "Pressure (psi)",
          tickValues: ticks( 200, 10 ),
          axisLabelDistance: -25
        }
      }
    };
  }

  function ticks( max, step ) {
    var temp = [];
    for ( var i = 0; i <= max; i  += step ) {
      temp.push( i );
    }
    return temp;
  }

  function graphData( data ) {
    return [
      {
        values: data[0],
        color: "#222",
        key: "Discharge Rate"
      },
      {
        values: data[1],
        color: "#222",
        key: "Pressure"
      }
    ];
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
  function getRows( data, type ) {
    return data.flowTestArr[type] ? data.flowTestArr[type].length : 0;
  }

  function calculatePadding( rows, qty ) {
    var temp = [];
    for ( var i = 1; i <= qty - rows; i += 1 ) {
      temp.push( i );
    }
    return temp;
  }
} );
