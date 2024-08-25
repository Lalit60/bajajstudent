const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

const userSchema = new mongoose.Schema({
  userId: String,
  email: String,
  rollNumber: String,
  numbers: [String],
  alphabets: [String],
  highestLowercaseAlphabet: [String],
});

const User = mongoose.model("User", userSchema);

app.post("/bfhl", async (req, res) => {
  const { data } = req.body;
  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => isNaN(item));
  const highestLowercaseAlphabet = alphabets
    .filter((item) => item === item.toLowerCase())
    .sort()
    .slice(-1);

  const user = new User({
    userId: "john_doe_17091999",
    email: "john@xyz.com",
    rollNumber: "ABCD123",
    numbers,
    alphabets,
    highestLowercaseAlphabet,
  });

  await user.save();

  res.json({
    is_success: true,
    user_id: user.userId,
    email: user.email,
    roll_number: user.rollNumber,
    numbers: user.numbers,
    alphabets: user.alphabets,
    highest_lowercase_alphabet: user.highestLowercaseAlphabet,
  });
});

app.get("/bfhl", (req, res) => {
  res.json({ operation_code: 1 });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
