const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongourl = require("./secrets").mongourl;
const app = express();
const port = 8000;
const cors = require("cors");

require("./models/Users");
require("./models/Worklist");
require("./models/Tasklist");
const authRoutes = require("./routes/auth");
const workspaceRoutes = require("./routes/workspace");
const taskRoutes = require("./routes/task");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(authRoutes);
app.use(taskRoutes);
app.use(workspaceRoutes);
mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

app.post("/", async (req, res) => {
  console.log(req.body);
  console.log("POST /workspace route hit");

  res.send("ok");
});
app.listen(port, () => {
  console.log("Server is running on port 8000");
});
