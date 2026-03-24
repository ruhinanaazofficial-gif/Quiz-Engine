const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "quizdb"
});

module.exports = db;