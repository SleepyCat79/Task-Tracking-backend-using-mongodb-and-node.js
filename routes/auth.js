const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../secrets").jwtkey;

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(422)
      .json({ error: "User already exists with that email" });
  }
  try {
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.send({ token });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).json({ error: "Invalid Email or password" });
  }

  if (user.password === password) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET); // Generate token
    res.json({ token, name: user.name });
  } else {
    return res.status(422).json({ error: "Invalid Email or password" });
  }
});

module.exports = router;
