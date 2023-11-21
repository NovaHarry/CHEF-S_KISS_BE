const { sendMail } = require("./sendMail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const userVerificationSchema = require("../models/userVerificationSchema");
const userSchema = require("../models/userSchema");
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
      randomString: "",
    });

    const activationLink = `https://chefs-kiss-be.onrender.com/signup/${token}`;

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
  const token = jwt.sign({ email }, process.env.signup_token);
  return token;
};

const insertSignUpUser = async (token) => {
  try {
    const userVerify = await userVerificationSchema.findOne({ token: token });

    if (userVerify) {
      const newUser = new userSchema({
        userName: userVerify.userName,
        email: userVerify.email,
        password: userVerify.password,
        token: token,
        randomString: "",
      });

      await newUser.save();

      await userVerificationSchema.deleteMany({ email: userVerify.email });

      const content = `<h4>Hi, there!</h4>
    <h5>Welcome to the app</h5>
    <p>You are successfully registered.</p>`;

      sendMail(newUser.email, "Registeration successful", content);
      return `<h4>Registeration successful.</h4>
    <h5>Welcome to the app</h5>
    <p>You are successfully registered.</p>`;
    }
    return `<h4>Registeration failed.</h4>
    <h5>Link expired!!!!.</h5>
    <p>Try again</p>`;
  } catch (error) {
    console.log(error);
    return `<html>
    <body>
    <h4>Registeration failed.</h4>
    <h5>Unexpected error.</h5>
    <p>Try again</p>
    </body>
    </html>`;
  }
};
module.exports = { insertVerifyUser, insertSignUpUser };
