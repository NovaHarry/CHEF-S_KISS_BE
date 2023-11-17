const express = require("express");
const { checkUser } = require("../controllers/login");
const { insertVerifyUser } = require("../controllers/signUp");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
  } catch (error) {}
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
