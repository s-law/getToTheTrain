var mongoose = require('mongoose');

var BartSchema = new mongoose.Schema({
  fullname: String,
  shortname: String,
  lonDist: Number,
  latDist: Number
})

module.exports = mongoose.model('Bart', BartSchema);
