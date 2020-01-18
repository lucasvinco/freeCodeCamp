const Thread = require('../models/thread');

function ThreadController() {
    this.getThreads = async function (board) {
        const threads = Thread.find({
            board
        }, { replies: { $slice: 3 } })
            .select({
                reported: 0,
                delete_password: 0,
                'replies.reported': 0,
                'replies.delete_password': 0
            })
            .sort({
                bumped_on: -1
            })
            .limit(10);

        return threads;
    }

    this.getReplies = function (threadId) {
        const threads = Thread.findById({
            _id: threadId
        })
            .select({
                reported: 0,
                delete_password: 0,
                'replies.reported': 0,
                'replies.delete_password': 0
            })

        return threads;
    }

    this.saveThread = async function (data) {
        const thread = new Thread(data);
        try {

            /*if (data.replies && Array.isArray(data.replies)) {
                for (let i = 0; i < data.replies.length; i++) {
                    thread.replies.push(data.replies[0]);
                }
            }*/

            await thread.save();
        } catch (e) {
            console.log(e);
        }
    }

    this.saveReply = async function (trheadId, data) {
        try {
            let thread = await Thread.findById(trheadId);

            if (thread) {
                await Thread.updateOne({ _id: trheadId }, {
                    "$push": {
                        "replies": {
                            "$each": [data],
                            "$sort": { "created_on": -1 }
                        }
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    this.updateThread = async function (thread_id) {
        try {
            const thread = await Thread.findById(thread_id);

            if (thread) {
                thread.toObject();
                thread.reported = true;
                delete thread._id;

                await Thread.updateOne({ _id: thread_id }, thread);

                return 'success';
            }

            return 'thread not found';
        } catch (e) {
            console.log(e);
        }
    }

    this.updateReply = async function (thread_id, reply_id) {
        try {
            const thread = await Thread.findById(thread_id);

            if (thread) {
                let reply;
                let { replies } = thread;
                for (let i = 0; i < replies.length; i++) {
                    console.log(replies[i]._id, reply_id);
                    if (replies[i]._id == reply_id) {
                        replies[i].reported = true;
                        thread.replies = replies;
                        thread.toObject();
                        delete thread._id;

                        await Thread.updateOne({ _id: thread_id }, thread);

                        return 'success';
                    }
                }
            }

            return 'reply not found';
        } catch (e) {
            console.log(e);
        }
    }

    this.deleteThread = async function (thread_id, delete_password) {
        try {
            const thread = await Thread.findById(thread_id);

            if (thread && thread.delete_password === delete_password) {
                await Thread.deleteOne({ _id: thread._id });

                return 'success';
            } else {
                return 'incorrect password';
            }
        } catch (e) {
            console.log(e);
        }
    }

    this.deleteReply = async function (thread_id, reply_id, delete_password) {
        try {
            const thread = await Thread.findById(thread_id);

            if (thread) {
                let reply;
                let { replies } = thread;
                for (let i = 0; i < replies.length; i++) {
                    console.log(replies[i]._id, reply_id, replies[i].delete_password, delete_password);
                    if (replies[i]._id == reply_id && replies[i].delete_password === delete_password) {
                        replies[i].text = '[deleted]';
                        thread.replies = replies;
                        thread.toObject();
                        delete thread._id;

                        await Thread.updateOne({ _id: thread_id }, thread);

                        return 'success';
                    }
                }
            }

            return 'incorrect password';
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = ThreadController;
