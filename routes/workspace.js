const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const Workspace = mongoose.model("Workspace");
const Task = mongoose.model("Task");
router.post("/workspace", async (req, res) => {
  const { userID, name, description } = req.body;
  try {
    const owner = await User.findById(userID);
    if (!owner) {
      return res.status(422).json({ error: "User not found" });
    }
    const workspace = new Workspace({
      name,
      description,
      users: [owner._id],
      owner: owner._id,
    });
    await workspace.save();
    res.json({ status: "success", message: "Workspace created" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
router.delete("/workspace/", async (req, res) => {
  const { id } = req.body;
  try {
    const workspace = await Workspace.findById(id);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }
    await Workspace.deleteOne({ _id: id });
    res.json({ status: "success", message: "Workspace deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/workspace", async (req, res) => {
  const { userID } = req.query;
  try {
    const workspaces = await Workspace.find({ users: userID });
    res.json({ workspaces });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.get("/members", async (req, res) => {
  const { workspaceID } = req.body;
  try {
    const workspace = await Workspace.findById(workspaceID).populate("users");
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }
    res.json(workspace.users);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.post("/members", async (req, res) => {
  const { workspaceID, email } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const workspace = await Workspace.findByIdAndUpdate(
      workspaceID,
      { $push: { users: user._id } },
      { new: true }
    );
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }
    res.json(workspace);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.delete("/members", async (req, res) => {
  const { workspaceID, userID } = req.body;
  try {
    const workspace = await Workspace.findByIdAndUpdate(
      workspaceID,
      { $pull: { users: userID } },
      { new: true }
    );
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }
    res.json(workspace);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

module.exports = router;
