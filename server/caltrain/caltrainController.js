var Caltrain = require('./caltrainModel.js');
var utils = require('../config/utils.js');
var caltrainApiKey = require('../config/apiKeys.js').caltrain;

module.exports = {
  allStations: function(req, res, next) {
    Caltrain.find({}, function(err, stations) {
      var stationList = {};

      stations.forEach(function(station) {
        stationList[station.station] = {
          stopCodeNorth: station.stopCodeNorth,
          stopCodeSouth: station.stopCodeSouth,
          location: [station.lon, station.lat]
        }
      });
      res.send(stationList);
    })
  },

  nearestStation: function(req, res, next) {
    res.status(200).send('Caltrain departure information coming soon!');
  }
}
