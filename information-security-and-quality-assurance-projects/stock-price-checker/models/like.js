const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    ip: { type: String, required: true },
    stockId: {
        type: String,
        ref: 'Stocks',
        index: true
    }
})

likeSchema.index({ ip: 1, stockId: 1 }, { unique: true })

module.exports = mongoose.model('Like', likeSchema);