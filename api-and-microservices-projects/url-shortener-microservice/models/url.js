var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var urlSchema = new Schema({
  id: { type: Number, required: true },
  url: { type: String, required: true }
});

module.exports = mongoose.model("Url", urlSchema);