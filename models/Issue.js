const mongoose = require('mongoose');

const issueSchemaOptions = {
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on'
    }
};

const IssueSchema = mongoose.Schema({

    projectId: { type: String, required: true },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: ''},
    open: { type: Boolean, default: true },
    status_text: { type: String, default: '' }

}, issueSchemaOptions);

const Issue = mongoose.model('issues', IssueSchema);

module.exports = Issue; 