"use strict";

var principal = "./src/index.js";
var watch = [ principal, "src/*.js", "src/**/*.js" ];
var test = [ "test/*.js", "test/**/*.js" ];

module.exports = {
  scripts: {
    principal: principal,
    watch: watch,
    test: test,
    todas: watch.concat( test )
  }
};
