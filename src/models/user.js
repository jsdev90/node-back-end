"use strict";

var mongoose = require( "mongoose" );
var schema = new mongoose.Schema( {
  email: { type: String, unique: true },
  password: { type: String, select: false },
  odooId: {type: String, unique: true},
  name: {type: String, required: true},
  picture: String,
  google: String,
  state: {type: Boolean, default: true},
  role: {type: String, default: "Regular"},
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
  }
} );

var User = mongoose.model( "User", schema );

module.exports = User;
