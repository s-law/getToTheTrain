var Bart = require('./bartModel.js');

module.exports = {
  allStations: function(req, res, next) {
    Bart.find({}, function(err, stations) {
      console.log(stations);
      var stationList = {};

      stations.forEach(function(station) {
        stationList[station.shortname] = [station.lonDist, station.latDist];
      });
      res.send(stationList);
    });
  },

  nearestStation: function(req, res, next) {
    return;
  }
}
