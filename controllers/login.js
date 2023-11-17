const userModel = require("../models/userSchema");

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

module.exports = { checkUser };
