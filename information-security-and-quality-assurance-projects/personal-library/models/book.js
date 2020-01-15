const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String, unique: true, required: true },
    comments: [String],
    commentcount: { type: Number, default: 0 }
})

module.exports = mongoose.model('Book', bookSchema);