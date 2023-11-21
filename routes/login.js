const express = require("express");
const { authenticateUser } = require("../controllers/login");
const userSchema = require("../models/userSchema");
const { sendMail } = require("../controllers/sendMail");
const router = express.Router();
const bcrypt = require("bcrypt");

const randomStringss = () => {
  randomStrings = Math.random().toString(36).substring(2, 15);
  return randomStrings;
};

router.post("/", async (req, res) => {
  try {
    const { email, password } = await req.body;
    var loginCredentials = await authenticateUser(email, password);

    if (loginCredentials === "Invalid Username or Password") {
      res.status(200).send("Invalid Username or Password");
    } else if (loginCredentials === "Server Busy") {
      res.status(200).send("Server Busy");
    } else {
      res.status(200).json({ token: loginCredentials.token });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/forgot-password/:email", async (req, res) => {
  try {
    const userById = await userSchema.findOne({ email: req.params.email });

    if (userById) {
      const activationLink = `https://funny-quokka-bd36b6.netlify.app/update-password/${userById.token}`;

      randomStringss();

      userById.randomString = randomStrings;

      await userById.save();

      const content = `
    <h4>Hi, there!</h4>
    <h5>FORGOT PASSWORD LINK</h5>
    <p>Click the link to reset your account password</p>
    <a href="${activationLink}">Click Here</a>`;

      sendMail(userById.email, "Forgot Password", content);

      res.status(200).send({
        userById,
        message: "User data for the ID fetched successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/update-password/:token", async (req, res) => {
  try {
    const userById = await userSchema.findOne({ token: req.params.token });

    console.log(userById.randomString);

    if (userById.randomString !== "") {
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      console.log(hashedPassword);

      userById.password = hashedPassword;

      userById.randomString = "";

      await userById.save();

      const content = `
      <h4>Hi, there!</h4>
      <h5>Password updated successfully</h5>`;

      sendMail(userById.email, "PASSWORD UPDATED", content);

      res.status(200).send({
        message: "Password Updated Successfully",
      });
    } else {
      res.status(400).send({
        message:
          "You've entered into an incorrect link or the expired link. Try generating a new link.",
      });
    }
  } catch (error) {
    res.status(500).send({
      message:
        "You've entered into an incorrect link or the expired link. Try generating a new link.",
      error,
    });
  }
});

module.exports = router;
