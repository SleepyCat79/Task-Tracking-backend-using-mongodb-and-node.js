const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const Workspace = mongoose.model("Workspace");
const Task = mongoose.model("Task");
const SubTask = mongoose.model("SubTask");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../secrets").jwtkey;

//create task
router.post("/Task", async (req, res) => {
  const { workspaceID, name, description, startDate, deadline, userEmails } =
    req.body;
  try {
    const workspace = await Workspace.findById(workspaceID);
    if (!workspace) {
      return res.status(422).json({ error: "Workspace not found" });
    }
    const status = new Date(startDate) > new Date() ? "upcoming" : "inprogress";

    // Find user IDs for the given emails
    const users = await User.find({ email: { $in: userEmails } });
    const userIds = users.map((user) => user._id);

    const task = new Task({
      name,
      description,
      workspaceId: workspace._id,
      startDate,
      deadline,
      status,
      users: userIds,
    });
    await task.save();
    await Workspace.updateOne(
      { _id: workspaceID },
      { $push: { tasklist: task._id } }
    );
    res.json({ status: "success", message: "Task created" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
//get task
router.get("/Task", async (req, res) => {
  const { workspaceID, userID } = req.query;
  try {
    const workspace = await Workspace.findById(workspaceID).populate({
      path: "tasklist",
      match: { users: userID },
    });
    if (!workspace) {
      return res.status(422).json({ error: "Workspace not found" });
    }
    res.json({ tasklist: workspace.tasklist });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
//delete task
router.delete("/Task", async (req, res) => {
  const { workspaceID, taskID } = req.query;
  try {
    const workspace = await Workspace.findById(workspaceID);
    if (!workspace) {
      return res.status(422).json({ error: "Workspace not found" });
    }
    await Task.deleteOne({ _id: taskID });
    await Workspace.updateOne(
      { _id: workspaceID },
      { $pull: { tasklist: taskID } }
    );
    // Use taskID directly in your query

    res.json({ status: "success", message: "Task deleted" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
//update task
router.put("/Task", async (req, res) => {
  const { workspaceID, taskID } = req.query;
  const { status } = req.body;
  try {
    const workspace = await Workspace.findById(workspaceID);
    if (!workspace) {
      return res.status(422).json({ error: "Workspace not found" });
    }
    await Task.updateOne({ _id: taskID }, { status });
    res.json({ status: "success", message: "Task updated" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

//get todolist for user with their id in specific task
router.get("/toDoList", async (req, res) => {
  const { userID, taskID } = req.query;
  try {
    const user = await User.findById(userID).populate("toDOList");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const toDoList = user.toDOList.filter((todo) => todo.taskID === taskID);
    res.json({ toDoList });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
module.exports = router;
//post todolist for user with their id
router.post("/toDoList", async (req, res) => {
  const { userID, name, taskID } = req.body;
  try {
    const user = await User.findById(userID);
    const todo = new SubTask({
      name,
      taskID,
    });
    await todo.save();
    await User.updateOne({ _id: user._id }, { $push: { toDOList: todo._id } });
    console.log(user); // Log the updated user
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "toDolist added" });
  } catch (err) {
    console.error(err); // Log any error
    return res.status(500).json({ error: err.message });
  }
});
router.post("/toDoListE", async (req, res) => {
  const { userEmail, name, taskID } = req.body;
  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const todo = new SubTask({
      name,
      taskID,
    });
    await todo.save();
    await User.updateOne({ _id: user._id }, { $push: { toDOList: todo._id } });
    console.log(user); // Log the updated user
    res.json({ message: "toDolist added" });
  } catch (err) {
    console.error(err); // Log any error
    return res.status(500).json({ error: err.message });
  }
});
//delete todolist for user with their id
router.delete("/toDoList", async (req, res) => {
  const { userID, todoID } = req.query;
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(422).json({ error: "User not found" });
    }
    await SubTask.deleteOne({ _id: todoID });
    await User.updateOne({ _id: userID }, { $pull: { toDOList: todoID } });
    res.json({ status: "success", message: "Todo deleted" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
//update todolist for user with their id
router.put("/toDoList", async (req, res) => {
  const { toDoID, name, state } = req.body;
  try {
    const updatedSubTask = await SubTask.updateOne(
      { _id: toDoID },
      { name, state }
    );
    if (updatedSubTask.nModified == 0) {
      return res.status(404).json({ error: "No Todo found to update" });
    }
    res.json({ status: "success", message: "Todo updated" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
