"use strict";
var _ = require( "lodash" );

module.exports = Commons;

function Commons( model ) {
  this.model = model;
}

Commons.prototype.findOne = wrapperFO;
Commons.prototype.findOneAndUpdate = putID;
Commons.prototype.count = count;
Commons.prototype.skipLimitABS = skipLimitABS;

function wrapperFO( req, res ) {
  var self = this;
  var id = req.params.id;
  return function findOne( resp ) {
    self.model.findOne( {"_id": id, "deleted": false}, function( err, obj ) {
      if ( err ) {
        return res.status( 500 ).send( err );
      }
      if ( _.isEmpty( obj ) ) {
        return res.status( 404 ).end();
      }
      return resp( res, obj );
    } );
  };
}

function putID( req, res ) {
  var self = this;
  var id = req.params.id;
  return function inner() {
    var query = {"_id": id, "deleted": false};
    var options = {multi: false, upsert: false, new: true, runValidators: true };
    self.model.findOneAndUpdate( query, req.body, options, function( err, obj ) {
      if ( err ) {
        return res.status( 500 ).send( err );
      }
      if ( _.isEmpty( obj ) ) {
        return res.status( 404 ).end();
      }
      return res.json( obj );
    } );
  };
}

function count( res, query, docs ) {
  query.exec( function( errorCont, resul ) {
    if ( errorCont ) {
      return res.status( 500 ).send( errorCont );
    } else {
      return res.json( {"docs": docs, "counter": resul} );
    }
  } );
}

function skipLimitABS( query ) {
  var qty = stabilize( query.qty );
  var total = stabilize( query.page ) * qty;
  return res( qty, total );
}

function res( cant, total ) {
  return {
    qty: cant,
    total: total
  };
}

function stabilize( param ) {
  return parseInt( param || 0 );
}
