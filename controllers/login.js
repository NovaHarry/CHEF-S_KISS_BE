const userModel = require("../models/userSchema");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const redisClient = require("../redis");
dotenv.config();

const checkUser = async (email) => {
  try {
    let userData = await userModel.findOne({ email: email });

    if (userData) {
      return true;
    }
    return false;
  } catch (error) {
    return "Server Busy";
  }
};

const authenticateUser = async (email, password) => {
  try {
    const userCheck = await userModel.findOne({ email: email });
    const validPassword = await bcrypt.compare(password, userCheck.password);

    if (validPassword) {
      const token = jwt.sign({ email }, process.env.login_token);

      console.log(token);

      const response = {
        id: userCheck._id,
        userName: userCheck.userName,
        email: userCheck.email,
        token: token,
        status: true,
      };

      await redisClient.set(`key-${email}`, JSON.stringify(response));

      await userModel.findOneAndUpdate(
        { email: userCheck.email },
        { $set: { token: token } },
        { new: true }
      );
      return response;
    }
    return "Invalid Username or Password";
  } catch (error) {
    console.log(error);
    return "Server Busy";
  }
};

const authorizeUser = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.login_token);

    if (decodedToken) {
      const email = decodedToken.email;
      const auth = await redisClient.get(`key-${email}`);
      if (auth) {
        const data = JSON.parse(auth);
        return data;
      } else {
        const data = userModel.findOne({ email: email });
        return data;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { checkUser, authenticateUser, authorizeUser };
