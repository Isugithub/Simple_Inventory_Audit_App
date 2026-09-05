require("dotenv").config();

const app = require("../app");
const connectDB = require("../config/db");

let databaseConnection;

module.exports = async (req, res) => {
  databaseConnection = databaseConnection || connectDB();
  await databaseConnection;
  return app(req, res);
};
