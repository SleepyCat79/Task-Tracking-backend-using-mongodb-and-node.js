const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const Workspace = mongoose.model("Workspace");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../secrets").jwtkey;

router.post("/createwp/:userId", async (req, res) => {
  const { name, tasklist, users } = req.body;
  const { userId } = req.params;
  const owner = userId;
  try {
    const workspace = new Workspace({ name, tasklist, users, owner });
    await workspace.save();
    res.json({ message: "Workspace created" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
router.get("/getwp/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const workspaces = await Workspace.find({ owner: userId });
    res.json({ workspaces });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

module.exports = router;
