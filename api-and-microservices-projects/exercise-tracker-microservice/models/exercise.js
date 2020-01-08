const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const exerciseSchema = new Schema({
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    username: { type: String },
    userId: { type: String, ref: 'User' }
})

module.exports = mongoose.model('Exercise', exerciseSchema);