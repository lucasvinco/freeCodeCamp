const Issue = require('../models/issue');
const Project = require('../models/project');

function IssueController() {
    this.get = async function (projectName, params) {
        let project = await Project.find({ name: projectName });

        if (project.length > 0) {
            let from = new Date(params.created_on);
            console.log(from);

            let searchObject = {};
            searchObject.projectId = project[0]._id;
            if (params._id) searchObject._id = params._id;
            if (from != 'Invalid Date') searchObject.created_on = params.created_on;
            if (params.open) searchObject.open = params.open;
            if (params.assigned_to) searchObject.assigned_to = params.assigned_to;
            if (params.created_by) searchObject.created_by = params.created_by;

            let issues = await Issue.find(searchObject);
            return issues;
        } else {
            return [];
        }
    }

    this.save = async function (projectName, issueData) {
        let project = await Project.find({ name: projectName });

        if (project.length < 1) {
            project = new Project({ name: projectName });
            await project.save();
        }

        let issue = new Issue(issueData);
        issue.projectId = Array.isArray(project) ? project[0]._id : project._id;
        issue.assigned_to = issueData.assigned_to ? issueData.assigned_to : '';
        issue.status_text = issueData.status_text ? issueData.status_text : '';
        try {
            await issue.save({ validateBeforeSave: true });
            issue = issue.toObject();
            delete issue.__v;
            delete issue.projectId;
            return issue;
        } catch (e) {
            //console.log(e);
            return 'missing required fields';
        }
    }

    this.update = async function (issueData) {
        try {
            let issue = await Issue.findById(issueData._id);
            console.log(issue);

            if (issueData._id && (issueData.issue_title || issueData.issue_text || issueData.created_by || issueData.assigned_to || issueData.status_text || issueData.open)) {

                issueData.issue_title && issueData.issue_title.trim() != issue.issue_title ? issueData.issue_title.trim() : issue.issue_title;
                issueData.issue_text && issueData.issue_text.trim() != issue.issue_text ? issueData.issue_text.trim() : issue.issue_text;
                issueData.created_by && issueData.created_by.trim() != issue.created_by ? issueData.created_by.trim() : issue.created_by;
                issueData.assigned_to && issueData.assigned_to.trim() != issue.assigned_to ? issueData.assigned_to.trim() : issue.assigned_to;
                issueData.status_text && issueData.status_text.trim() != issue.status_text ? issueData.status_text.trim() : issue.status_text;
                issueData.open && issueData.open != issue.open ? issueData.open : issue.open;

                let id;
                try {
                    id = issueData._id;
                    delete issueData._id;
                    let updatedIssue = new Object(issueData);
                    updatedIssue.created_on = issue.created_on;
                    updatedIssue.updated_on = new Date().getTime();
                    console.log(updatedIssue);
                    await Issue.updateOne({ _id: id }, updatedIssue);
                    return 'successfully updated';
                } catch (e) {
                    console.log(e);
                    return `could not update ${id}`;
                }
            } else {
                return 'no updated field sent';
            }
        } catch (e) {
            console.log(e);
            return `could not update ${issueData._id}`;
        }
    }

    this.delete = async function (issueId) {
        if (issueId) {
            try {
                await Issue.deleteOne({ _id: issueId });
                return `deleted ${issueId}`;
            } catch (e) {
                console.log(e);
                return `could not delete ${issueId}`;
            }
        } else {
            return '_id error';
        }
    }
}

module.exports = IssueController;