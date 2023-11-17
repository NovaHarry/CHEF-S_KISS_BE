const mongoose = require("mongoose");
const validator = require("validator");

let userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: (value) => {
        return validator.isEmail(value);
      },
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    token: {
      type: String,
    },
  },
  {
    collection: "userData",
  }
);

module.exports = mongoose.model("userData", userSchema);
