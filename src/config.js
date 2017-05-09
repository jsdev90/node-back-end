"use strict";

if ( !process.env.AWS_ACCESS_KEY_ID ) {
  process.env.AWS_ACCESS_KEY_ID = "AKIAICP3IHTUHCH6O4BQ";
}
if ( !process.env.AWS_SECRET_ACCESS_KEY ) {
  process.env.AWS_SECRET_ACCESS_KEY = "qOi/SiklwPJeZcuowIP3TyDdFxYNJIB5E67O54a/";
}

module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || "Sunlight Yellow Overdrive",
  PORT: process.env.PORT || 3001,
  ORIGIN: process.env.ORIGIN || "http://localhost:3000",
  NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || "servidor@ciriscr.com",
  FIREBASE: "https://firelab-dev.firebaseio.com"
};
