const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const Workspace = mongoose.model("Workspace");
const Task = mongoose.model("Task");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../secrets").jwtkey;
//get todolist for user with their id
router.get("/toDoList", async (req, res) => {
  const { userID } = req.body;
  try {
    const user = await User.findById(userID)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const toDoList = user.todoList;
    res.json({ toDoList });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
module.exports = router;
//post todolist for user with their id
router.post("/toDoList", async (req, res) => {
  const { userID, task } = req.body;
  try {
    const user = await UserWeb.findByIdAndUpdate(
      userID,
      { $push: { todoList: { name: task, status: false } } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

});
//delete todolist for user with their id  
router.delete("/toDoList", async (req, res) => {
  const { userID, taskID } = req.body;
  try {
    const user = await UserWeb.findByIdAndUpdate(
      userID,
      { $pull: { todoList: { _id: taskID } } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
//update todolist for user with their id
router.put("/toDoList", async (req, res) => {
  const { userID, taskID } = req.body;
  try {
    const user = await UserWeb.findOneAndUpdate(
      { _id: userID, "todoList._id": taskID },
      { $set: { "todoList.$.status": true } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  }
  catch (err) {
    return res.status(500).json({ error: err.message });
  }

});

/// create task for workspace 
router.post("/task", async (req, res) => {
  const { WorkspaceID, task } = req.body;
  try {
    const workspace = await Workspace.findById(WorkspaceID);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }
    const newTask = new Task({
      name: task.name,
      description: task.description,
      users: task.users,
      subtasks: task.subtasks,
      startDate: task.startDate,
      deadline: task.deadline,
      status: task.status,
      workspaceId: WorkspaceID,
    });
    await newTask.save();
    await Workspace.findByIdAndUpdate(
      WorkspaceID,
      { $push: { tasklist: newTask._id } },
      { new: true }
    );
    res.json(newTask);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

});
