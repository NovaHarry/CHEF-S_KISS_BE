const express = require("express");
const recipeSchema = require("../models/recipeSchema");
const userSchema = require("../models/userSchema");
const redisClient = require("../redis");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let recipeData = await recipeSchema.find();

    res.status(200).send(recipeData);
  } catch (error) {
    console.log(error);
    res.status(400).send("Server Busy");
  }
});

router.get("/:id", async (req, res) => {
  try {
    let openRecipeData = await recipeSchema.findOne({ _id: req.params.id });

    res.status(200).send(openRecipeData);
  } catch (error) {
    console.log(error);
    res.status(400).send("Server Busy");
  }
});

router.post("/addrecipe", async (req, res) => {
  try {
    let recipeTitle = await recipeSchema.findOne({
      recipeTitle: req.body.recipeTitle,
    });

    let userEmail = await recipeSchema.findOne({
      email: req.body.email,
    });

    if (!(recipeTitle && userEmail)) {
      let recipe = await recipeSchema.create(req.body);

      await recipe.save();

      res.status(200).send({
        message: "Recipe added successfully",
      });
    } else {
      res.status(400).send({
        message: "Recipe already exist!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal server error",
      error,
    });
  }
});

module.exports = router;
