const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const Workspace = mongoose.model("Workspace");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../secrets").jwtkey;


router.get("/getwp/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const workspaces = await Workspace.find({ owner: userId });
    res.json({ workspaces });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.post("/worksace", async (req, res) => {
  const { userID, name, description } = req.body;
  try {
    const owner = await User.findById(userID);
    if (!owner) {
      return res.status(422).json({ error: "User not found" });
    }
    const workspace = new Workspace({ name, description, users: [owner], owner });
    await workspace.save();
    res.json({ status: "success", message: "Workspace created" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.get("/workspace", async (req, res) => {
  const { userID } = req.body;
  try {
    const workspaces = await Workspace.find({ users: userID });
    res.json({ workspaces });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
})

module.exports = router;