const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.Mongo_DB_Url);
    console.log("Connected to DB successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDb;
