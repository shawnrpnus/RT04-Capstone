const express = require("express");
const app = express();
require("express-async-errors");
require("dotenv").config();
require("./startup/cors")(app);
require("./startup/routes")(app);
const axios = require("axios");

// app.use(express.static(path.join(__dirname, "frontend", "build")));

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
module.exports = server;

axios
  .post("http://localhost:8080/pay")
  .then(function(response) {
    console.log(response);
  })
  .catch(function(error) {
    console.log(error);
  });
