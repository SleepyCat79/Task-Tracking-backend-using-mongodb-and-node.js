const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  usertask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
});

mongoose.model("User", userSchema);
