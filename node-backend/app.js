require("express-async-errors");
const config = require("config");
const express = require("express");
const app = express();
const axios = require("axios");
require("./startup/cors")(app);
// require("./startup/db")();
require("./startup/routes")(app);

// app.use(express.static(path.join(__dirname, "frontend", "build")));

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
module.exports = server;
