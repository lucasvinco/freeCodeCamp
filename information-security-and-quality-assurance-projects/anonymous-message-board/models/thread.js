const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadSchema = new Schema({
    board: { type: String, index: true, required: true },
    text: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    bumped_on: { type: Date, default: Date.now },
    reported: { type: Boolean, default: false },
    delete_password: { type: String, required: true },
    replies: { type: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            index: true,
            auto: true
        },
        text: { type: String, required: true },
        created_on: { type: Date, default: Date.now },
        reported: { type: Boolean, default: false },
        delete_password: { type: String, required: true },
    }], default: []}
})

module.exports = mongoose.model('Thread', threadSchema);