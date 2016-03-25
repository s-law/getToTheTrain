var Caltrain = require('./caltrainModel.js');
var utils = require('../config/utils.js');
var caltrainApiKey = require('../config/apiKeys.js').caltrain;

module.exports = {
  allStations: function(req, res, next) {
    res.status(200).send('Caltrain station information coming soon!');
  },

  nearestStation: function(req, res, next) {
    res.status(200).send('Caltrain departure information coming soon!');
  }
}
