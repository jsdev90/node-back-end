"use strict";

module.exports = "Bearer " + require( "../src/login/middleware.js" ).createJWT( {"_id": 1} );
