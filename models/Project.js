const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({

    name: {type: String, required: true}

});

const Project = mongoose.model('projects', ProjectSchema);

module.exports = Project;   