var mongoose = require("mongoose");

var StatSchema = new mongoose.Schema({
  date: String,
  mono: Array,
  user: String
});

module.exports = mongoose.model("Mono", StatSchema);
