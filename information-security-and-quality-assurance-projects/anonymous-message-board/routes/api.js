/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const ThreadController = require('../controllers/threadController');

module.exports = function (app) {

    const threadController = new ThreadController();

    app.route('/api/threads/:board')
        .get(async (req, res) => {
            const { board } = req.params;

            const threads = await threadController.getThreads(board);

            res.json(threads);
        })
        .post(async (req, res) => {
            const { board } = req.params;
            const { text, delete_password, replies } = req.body;

            await threadController.saveThread({ board, text, delete_password, replies });

            res.redirect(`/b/${board}`);
        })
        .put(async (req, res) => {
            const { thread_id } = req.body;

            try {
                let result = await threadController.updateThread(thread_id);

                res.send(result);
            } catch(e) {
                console.log(e);
            }
        })
        .delete(async (req, res) => {
            const { thread_id, delete_password } = req.body;

            try {
                let result = await threadController.deleteThread(thread_id, delete_password);

                res.send(result);
            } catch (e) {
                console.log(e);
            }
        })

    app.route('/api/replies/:board')
        .get(async (req, res) => {
            const { thread_id } = req.query;

            const thread = await threadController.getReplies(thread_id);

            res.json(thread);
        })
        .post(async (req, res) => {
            const { board } = req.params;
            const { text, delete_password, thread_id } = req.body;

            await threadController.saveReply(thread_id, { text, delete_password });

            res.redirect(`/b/${board}/${thread_id}`);
        })
        .put(async (req, res) => {
            const { thread_id, reply_id } = req.body;

            try {
                let result = await threadController.updateReply(thread_id, reply_id);

                res.send(result);
            } catch(e) {
                console.log(e);
            }
        })
        .delete(async (req, res) => {
            const { thread_id, reply_id, delete_password } = req.body;

            try {
                let result = await threadController.deleteReply(thread_id, reply_id, delete_password);

                res.send(result);
            } catch (e) {
                console.log(e);
            }
        })

};