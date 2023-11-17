const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send("workingggg");
});

router.post("/verify", async (req, res) => {});

module.exports = router;
