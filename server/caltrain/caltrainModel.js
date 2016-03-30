var mongoose = require('mongoose');

var CaltrainSchema = new mongoose.Schema({
  name: String,
  webName: String,
  stopCodeNorth: String,
  stopCodeSouth: String,
  lon: Number,
  lat: Number
})

module.exports = mongoose.model('Caltrain', CaltrainSchema, 'Caltrains');
