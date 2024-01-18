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
    res.json({ status: "success" });
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
    res.json({ status: "success", userID: user._id, name: user.name });
  } else {
    return res.status(422).json({ error: "Invalid Email or password" });
  }
});

// WEB-------------------------------------------------------------------------------------------------------

module.exports = router;
