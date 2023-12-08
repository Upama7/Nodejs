const exp = require("constants");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

app.get("/", (req, res) => {
  res.send("Get Route");
});

const start = async () => {
  try {
    await mongoose.connect(CONNECTION);

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (error) {
    console.log(error.message);
  }
};

start();
