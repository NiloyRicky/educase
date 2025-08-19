const mysql = require("mysql2");
require("dotenv").config();
const fs = require("fs");
const db = mysql.createConnection({
    host: process.env.TIDB_HOST,
  port: process.env.TIDB_PORT,
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: {
    ca: fs.readFileSync(process.env.TIDB_CA), // use the CA cert
  },
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

module.exports = db;
