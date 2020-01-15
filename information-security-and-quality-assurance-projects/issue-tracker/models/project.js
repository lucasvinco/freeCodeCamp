const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: { type: String, unique: true, required: true }
})

module.exports = mongoose.model('Project', projectSchema);