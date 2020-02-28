const express = require("express");
const app = express();
require("express-async-errors");
require("dotenv").config();
require("./startup/cors")(app);
require("./startup/routes")(app);

// app.use(express.static(path.join(__dirname, "frontend", "build")));

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
module.exports = server;
