const express = require("express");
const { authenticateUser } = require("../controllers/login");
const router = express.Router();

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

module.exports = router;
