const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

const userSchema = new Schema({
    _id: { type: String, default: shortid.generate },
    username: { type: String, required: true }
})

module.exports = mongoose.model('User', userSchema);