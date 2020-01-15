/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const IssueController = require('../controllers/issueController');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

    let issueController = new IssueController();

    app.route('/api/issues/:project')

        .get(async function (req, res) {
            let project = req.params.project;

            let result = await issueController.get(project, req.query);
            res.json(result);
        })

        .post(async function (req, res) {
            let project = req.params.project;
            
            //issue_title, issue_text, created_by, and optional assigned_to and status_text
            const issue = await issueController.save(project, req.body);
            if(issue && typeof issue != 'string')
                res.json(issue);
            else
                res.send(issue);
        })

        .put(async function (req, res) {
            let project = req.params.project;

            const result = await issueController.update(req.body);

            res.send(result);
        })

        .delete(async function (req, res) {
            let project = req.params.project;

            const result = await issueController.delete(req.body._id);

            res.send(result);
        });

};