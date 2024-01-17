const mongoose = require("mongoose");
const DateSchema = new mongoose.Schema({
    date: Number,
    month: Number,
    year: Number
}, { _id: false });
const MemberSchema = new mongoose.Schema({
    name: String,
    id: String,
    mail: String
}, { _id: false });
const SubTaskSchema = new mongoose.Schema({
    name: String,
    status: Boolean
});
const TaskSchema = new mongoose.Schema({
    name: String,
    start: DateSchema,
    end: DateSchema,
    member: [MemberSchema],
    status: String,
    subTask: [SubTaskSchema],
});

const WorkspaceWebSchema = new mongoose.Schema({
    name: String,
    taskList: [TaskSchema],
    leader: MemberSchema,
    memberList: [MemberSchema]
});
mongoose.model("WorkspaceWeb", WorkspaceWebSchema);