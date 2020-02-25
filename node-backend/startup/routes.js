const express = require("express");
// const error = require("../middleware/error");
// const admin = require("../routes/admins");
const email = require("../../routes/email");

module.exports = function(app) {
  app.use(express.json());
  app.use("/node/api/email", email);
  //   app.use("/api/images", express.static("images"));
  // app.use(error);
};
