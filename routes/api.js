'use strict';
const Project = require('../models/Project');
const Issue = require('../models/Issue');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(async (req, res) => {

      // get project name from path
      let projectName = req.params.project;

      // check if project already exists
      let project = await Project.findOne({ name: projectName }).exec().catch(err => console.log(err));

      // if project doesn't exist return an empty array
      if(!project) return res.status(200).json([]);

      // build filter based on request query
      const filter = req.query;

      // add projectId to filter
      filter.projectId = project.id;

      // find all issues filtering by the requests query
      // if successful return matching issues
      // if failure return error
      Issue.find(filter)
      .then( issues => {

        return res.status(200).json(issues);

      })
      .catch( err => {

        console.log(err);

        return res.status(200).json({
          error: 'Could not get issues'
        });

      });

    })

    .post(async (req, res) => {

      // get project name from path
      const projectName = req.params.project;

      // check if project already exists
      let project = await Project.findOne({ name: projectName }).exec().catch(err => console.log(err));

      // if project does not already exists create it and save it
      if (!project) {

        project = new Project({
          name: projectName
        });

        project = await project.save().catch(err => console.log(err));

      }

      // check if request has all required fields
      // if it does not respond with error
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {

        return res.status(200).json({
          error: 'required field(s) missing'
         });

      }

      const newIssue = req.body;
      newIssue.projectId = project.id;
      
      // create new issue
      const issue = new Issue(newIssue);

      // save issue
      // if save successful return newly created issue as json object
      // if save fails return error message
      issue.save()
      .then( issue => {

        res.status(200).json(issue);

      })
      .catch( err => {
        
        console.log(err);

        return res.status(200).json({
          error: 'Could not save issue'
        });

      });

    })

    .put(async (req, res) => {

      // get project name from path
      const projectName = req.params.project;

      // get project
      let project = await Project.findOne({ name: projectName }).exec().catch(err => console.log(err));

      // if project doesn't exist return error
      if (!project) return res.status(200).json({
        error: 'no such project'
      });

      // if no issue id provided return error
      if (!req.body._id) return res.status(200).json({
        error: 'missing _id'
      });

      // if only issue id sent return error
      if (Object.keys(req.body).length < 2) return res.status(200).json({
        error: 'no update field(s) sent',
        _id: req.body._id
      });
      
      // find issue by id
      const updatedIssue = await Issue.findByIdAndUpdate(req.body._id, req.body, { new: true }).catch( err => console.log(err));

      // if no issue found and updated return error
      if (!updatedIssue) return res.status(200).json({
        error: 'could not update',
        _id: req.body._id
      });

      // return updated issue
      return res.status(200).json({
        result: 'successfully updated',
        _id: updatedIssue._id
      });

    })

    .delete(async (req, res) => {

      // get project name from path
      let projectName = req.params.project;

      // check if project already exists
      let project = await Project.findOne({ name: projectName }).exec().catch(err => console.log(err));

      // if project doesn't exist return error
      if (!project) return res.status(200).json({
        error: 'no such project'
      });

      // if no issue id provided return error
      if (!req.body._id) return res.status(200).json({
        error: 'missing _id'
      });

      const deletedIssue = await Issue.findByIdAndDelete(req.body._id);

      if (!deletedIssue) return res.status(200).json({
        error: 'could not delete',
        _id: req.body._id
      });

      return res.status(200).json({
        result: 'successfully deleted',
        _id: deletedIssue._id
      });

    });

};