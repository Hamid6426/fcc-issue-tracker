const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectSchema = new Schema({
    name: { type: String, required: true },
    issues: [IssueSchema],
});

const Project = mongoose.model("Project", ProjectSchema);
exports.Project = Project;
