const mongoose = require("mongoose");
const validator = require("validator");

const userVerificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    token: {
      type: String,
      required: true,
    },
  },
  {
    collection: "user_verification",
  }
);

module.exports = mongoose.model("user_verification", userVerificationSchema);
