const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const Workspace = mongoose.model("Workspace");
const Task = mongoose.model("Task");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../secrets").jwtkey;

router.post("/createtask/:workspaceId", async (req, res) => {
  const { name, description, status } = req.body;
  const { workspaceId } = req.params;
  try {
    const task = new Task({ name, description, status, workspaceId });
    await task.save();
    res.json({ message: "Task created" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

module.exports = router;
