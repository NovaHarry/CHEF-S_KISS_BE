//EXPRESS

const express = require("express");
const app = express();
const port = 5000;

//MONGODB
const connectDb = require("./dbConfig");
connectDb();

//ROUTER
const signUpRouter = require("./routes/signUp");
const loginRouter = require("./routes/login");
const homeRouter = require("./routes/home");
const recipeRouter = require("./routes/recipes");

//CORS
const cors = require("cors");
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/signup", signUpRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);
app.use("/", recipeRouter);

app.get("/", async (req, res) => {
  res.send("working");
});

app.listen(port, () => {
  console.log("App is listening on port", port);
});
