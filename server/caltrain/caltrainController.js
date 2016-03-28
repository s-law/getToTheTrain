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
          location: [station.lat, station.lon]
        }
      });
      res.send(stationList);
    })
  },

  nearestStation: function(req, res, next) {
    var lat = req.body.lat;
    var lon = req.body.lon;

    Caltrain.find({}, function(err, stations) {
      var closest = stations.map(function(stn) {
        return [stn.station, utils.calcDistance(lat, lon, stn.lat, stn.lon), stn.stopCodeNorth, stn.stopCodeSouth];
      })
      .reduce(function(a, b) {
        return a[1] < b[1] ? a : b;
      });

      res.send(closest);
    });
  }
}
