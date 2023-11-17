const express = require("express");
const { checkUser } = require("../controllers/login");
const { insertVerifyUser, insertSignUpUser } = require("../controllers/signUp");
const router = express.Router();

router.get("/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const response = await insertSignUpUser(token);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(
      `<html>
    <body>
    <h4>Registeration failed.</h4>
    <h5>Unexpected error.</h5>
    <p>Try again</p>
    </body>
    </html>`
    );
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { userName, email, password } = await req.body;

    const registerCredentials = await checkUser(email);

    if (registerCredentials === false) {
      await insertVerifyUser(userName, email, password);

      res.status(200).send(true);
    } else if (registerCredentials === true) {
      res.status(200).send(false);
    } else if (registerCredentials === "Server Busy") {
      res.status(500).send("Server Busy");
    }
  } catch (error) {}
});

module.exports = router;
