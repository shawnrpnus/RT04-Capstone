const mysql = require("mysql");
const config = require("config");

// // Custom config
// const connection = mysql.createConnection({
//   host: config.get("sqlHost"),
//   user: config.get("sqlUser"),
//   password: config.get("sqlPassword"),
//   database: config.get("sqlDb")
// });

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "retaildb"
});

module.exports = function() {
  connection.connect(function(err) {
    if (err) {
      console.error("Error connecting to SQL database: " + err.stack);
      return;
    }
    console.log("Connected to SQL database with id " + connection.threadId);
  });
};

// module.exports = function() {
//   const db = config.get("db");
//   mongoose
//     .connect(db, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true
//     })
//     .then(() => console.log(`Connected to ${db}...`));
// };
