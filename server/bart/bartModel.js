var mongoose = require('mongoose');

var BartSchema = new mongoose.Schema({
  fullname: String,
  shortname: String,
  lon: Number,
  lat: Number
})

module.exports = mongoose.model('Bart', BartSchema, 'Barts');
