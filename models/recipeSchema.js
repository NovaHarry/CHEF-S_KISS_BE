const mongoose = require("mongoose");

let recipeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    recipeId: { type: String },
    recipeTitle: {
      type: String,
      required: true,
    },
    recipeDescription: {
      type: String,
      required: true,
    },
    recipeImage: { type: String, required: true },
    preparationTime: {
      type: String,
      required: true,
    },
    cookingTime: {
      type: String,
      required: true,
    },
    numberOfServings: {
      type: String,
      required: true,
    },
    ingredients: { type: Array, default: [] },
    directions: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
    ratings: {
      type: String,
      default: "3",
    },
  },
  {
    collection: "recipeCollections",
  }
);

module.exports = mongoose.model("recipeCollections", recipeSchema);
