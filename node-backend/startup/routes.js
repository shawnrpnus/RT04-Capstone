const express = require("express");
// const error = require("../middleware/error");
// const admin = require("../routes/admins");
const email = require("../routes/email");
const product = require("../routes/product");

module.exports = function(app) {
  app.use(express.json());
  app.use("/node/api/email", email);
  app.use("/node/api/product", product);
  app.use(express.static(__dirname + "/img/"));
  //   app.use("/api/images", express.static("images"));
  // app.use(error);
};
