const mongoose = require("mongoose");

const WorkspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: false,
  },
  tasklist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  users: {
    type: Array,
    required: false,
  },
  owner: {
    type: String,
    required: true,
  },
});

mongoose.model("Workspace", WorkspaceSchema);
