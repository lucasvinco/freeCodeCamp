/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

    let text = `Text ${new Date().getTime()}`;
    let threadId1, threadId2, replyId;

    suite('API ROUTING FOR /api/threads/:board', function () {

        suite('POST', function () {
            test('create 2 new threads(because we end up deleting 1 in the delete test)', function (done) {
                chai.request(server)
                    .post('/api/threads/general')
                    .send({ text: text, delete_password: '12345' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                    });
                chai.request(server)
                    .post('/api/threads/general')
                    .send({ text: text, delete_password: '12345' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        done();
                    });
            });
        });

        suite('GET', function () {
            test('most recent 10 threads with most recent 3 replies each', function (done) {
                chai.request(server)
                    .get('/api/threads/general')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        assert.isBelow(res.body.length, 11);
                        assert.property(res.body[0], '_id');
                        assert.property(res.body[0], 'created_on');
                        assert.property(res.body[0], 'bumped_on');
                        assert.property(res.body[0], 'text');
                        assert.property(res.body[0], 'replies');
                        assert.notProperty(res.body[0], 'reported');
                        assert.notProperty(res.body[0], 'delete_password');
                        assert.isArray(res.body[0].replies);
                        assert.isBelow(res.body[0].replies.length, 4);
                        threadId1 = res.body[0]._id;
                        threadId2 = res.body[1]._id;
                        done();
                    });
            });
        });

        suite('DELETE', function () {
            test('delete thread with good password', function (done) {
                chai.request(server)
                    .delete('/api/threads/general')
                    .send({ thread_id: threadId1, delete_password: '12345' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, 'success');
                        done();
                    });
            });

            test('delete thread with bad password', function (done) {
                chai.request(server)
                    .delete('/api/threads/general')
                    .send({ thread_id: threadId2, delete_password: '54321' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, 'incorrect password');
                        done();
                    });
            });
        });

        suite('PUT', function () {
            test('report thread', function (done) {
                chai.request(server)
                    .put('/api/threads/general')
                    .send({ thread_id: threadId2 })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, 'success');
                        done();
                    });
            });
        });


    });

    suite('API ROUTING FOR /api/replies/:board', function () {

        suite('POST', function () {
            test('reply to thread', function (done) {
                chai.request(server)
                    .post('/api/replies/general')
                    .send({ thread_id: threadId2, text: `Reply ${text}`, delete_password: '12345' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        done();
                    });
            });
        });

        suite('GET', function () {
            test('Get all replies for 1 thread', function (done) {
                chai.request(server)
                    .get('/api/replies/general')
                    .query({ thread_id: threadId2 })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.property(res.body, '_id');
                        assert.property(res.body, 'created_on');
                        assert.property(res.body, 'bumped_on');
                        assert.property(res.body, 'text');
                        assert.property(res.body, 'replies');
                        assert.notProperty(res.body, 'delete_password');
                        assert.notProperty(res.body, 'reported');
                        assert.isArray(res.body.replies);
                        assert.notProperty(res.body.replies[0], 'delete_password');
                        assert.notProperty(res.body.replies[0], 'reported');
                        assert.equal(res.body.replies[res.body.replies.length - 1].text, `Reply ${text}`);
                        replyId = res.body.replies[0]._id;
                        done();
                    });
            });
        });

        suite('PUT', function () {
            test('report reply', function (done) {
                chai.request(server)
                    .put('/api/threads/general')
                    .send({ thread_id: threadId2, reply_id: replyId })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, 'success');
                        done();
                    });
            });
        });

        suite('DELETE', function () {
            test('delete reply with bad password', function (done) {
                chai.request(server)
                    .delete('/api/threads/general')
                    .send({ thread_id: threadId2, reply_id: replyId, delete_password: '54321' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, 'incorrect password');
                        done();
                    });
            });

            test('delete reply with valid password', function (done) {
                chai.request(server)
                    .delete('/api/threads/general')
                    .send({ thread_id: threadId2, reply_id: replyId, delete_password: '12345' })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.text, 'success');
                        done();
                    });
            });
        });

    });

});