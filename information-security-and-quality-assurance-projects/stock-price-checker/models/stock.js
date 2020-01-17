const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    symbol: { type: String, unique: true, required: true },
    likecount: { type: Number, default: 0 }
})

module.exports = mongoose.model('Stock', stockSchema);