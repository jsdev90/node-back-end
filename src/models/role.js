"use strict";

var mongoose = require( "mongoose" );
var schema = new mongoose.Schema( {
  name: {
    type: String,
    default: "Name"
  },
  description: String,
  permissions: {
    user: {
      list: {type: Boolean, default: false},
      read: {type: Boolean, default: false},
      create: {type: Boolean, default: false},
      edit: {type: Boolean, default: false},
      remove: {type: Boolean, default: false}
    },
    role: {
      list: {type: Boolean, default: false},
      read: {type: Boolean, default: false},
      create: {type: Boolean, default: false},
      edit: {type: Boolean, default: false},
      remove: {type: Boolean, default: false}
    }
  },
  deleted: { type: Boolean, default: false, select: false, index: true }
} );

var model = mongoose.model( "role", schema );

exports.schema = schema;
exports.model = model;
