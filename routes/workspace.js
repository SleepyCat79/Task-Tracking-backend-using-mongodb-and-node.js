const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = mongoose.model("User");
const Workspace = mongoose.model("Workspace");
const workspaceWeb = mongoose.model("WorkspaceWeb");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../secrets").jwtkey;

router.post("/createwp/:userId", async (req, res) => {
  const { name, tasklist, users } = req.body;
  const { userId } = req.params;
  const owner = userId;
  try {
    const workspace = new Workspace({ name, tasklist, users, owner });
    await workspace.save();
    res.json({ message: "Workspace created" });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
router.get("/getwp/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const workspaces = await Workspace.find({ owner: userId });
    res.json({ workspaces });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

///--------------------------------------------WEB----------------------------------------------------------
// create workspace
router.post("/createwpweb/", async (req, res) => {
  const { name, owner, idUser, mail } = req.body;
  try {
    const workspace = new workspaceWeb({
      name: name,
      tasklist: [],
      leader: {
        name: owner,
        id: idUser,
        mail: mail
      },
      memberList: [{
        name: owner,
        id: idUser,
        mail: mail
      }]
    });
    await workspace.save();
    res.json({ message: "Workspace created" });
  }
  catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

module.exports = router;
/// get ALl workspaceId and Name with userId
router.get("/getwpweb", async (req, res) => {
  const { userID } = req.body;
  try {
    const workspace = await workspaceWeb.find({ "memberList.id": userID });
    const workspaceObject = workspace.map((item) => {
      return {
        id: item._id,
        name: item.name
      }
    })
    res.json({ workspaceObject });
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});
