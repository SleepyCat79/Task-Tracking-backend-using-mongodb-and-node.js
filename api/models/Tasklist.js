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
  users: {
    type: Array,
    required: false,
  },
  subtasks: {
    type: Array,
    required: false,
  },
  deadline: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: true,
    default: "To Do",
  },
  workspaceId: {
    type: String,
    required: true,
  },
});
mongoose.model("Task", TasklistSchema);
