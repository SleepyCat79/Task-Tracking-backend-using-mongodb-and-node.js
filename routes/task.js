const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const UserWeb = mongoose.model("UserWeb");
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
    await Workspace.updateOne(
      { _id: workspaceId },
      { $push: { tasklist: task._id } }
    );

    res.json({ message: "Task created" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.get("/gettasks/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const workspace = await Workspace.findById(workspaceId).populate(
      "tasklist"
    );
    res.json({ tasks: workspace.tasklist });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

///WEB-----------------------------------------------------------------------------------------------------------------
//get todolist for user with their id
router.get("/toDoList", async (req, res) => {
  const { userID } = req.body;
  try {
    const user = await UserWeb.findById(userID)
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
