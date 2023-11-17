const { sendMail } = require("./sendMail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userVerificationSchema = require("../models/userVerificationSchema");
dotenv.config();

const insertVerifyUser = async (userName, email, password) => {
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const token = generateToken(email);

    const newUser = new userVerificationSchema({
      userName: userName,
      email: email,
      password: hashedPassword,
      token: token,
    });

    const activationLink = "www.google.com";

    const content = `
    <h4>Hi, there!</h4>
    <h5>Welcome to the app</h5>
    <p>Click on the link to activate</p>
    <a href="${activationLink}">Click Here</a>`;

    await newUser.save();

    sendMail(email, "User Verification", content);
  } catch (error) {
    console.log(error);
  }
};

const generateToken = (email) => {
  const token = jwt.sign(email, process.env.signup_token);
  return token;
};

module.exports = { insertVerifyUser };
