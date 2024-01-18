const mongoose = require("mongoose");

const TasklistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  subtasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTask",
      required: false,
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  workspaceId: {
    type: String,
    required: true,
  },
});
const subTaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  state: {
    type: Boolean,
    default: false,
  },
});
mongoose.model("SubTask", subTaskSchema);
mongoose.model("Task", TasklistSchema);
