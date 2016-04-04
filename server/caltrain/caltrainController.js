var Caltrain = require('./caltrainModel.js');
var utils = require('../config/utils.js');

module.exports = {
  allStations: function(req, res, next) {
    Caltrain.find({}, function(err, stations) {
      var stationList = {};

      stations.forEach(function(station) {
        stationList[station.name] = {
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
        return [stn.webName, utils.calcDistance(lat, lon, stn.lat, stn.lon), stn.name];
      })
      .reduce(function(a, b) {
        return a[1] < b[1] ? a : b;
      });

      utils.caltrainScrape(closest[0], function(caltrainRawData) {
        // TODO: package raw data

        // TODO: change data being sent
        res.send(closest);
      });
    });
  }
}
