var mongoose = require("mongoose");

var StatSchema = new mongoose.Schema({
  date: String,
  mono: Array
});

module.exports = mongoose.model("Mono", StatSchema);
