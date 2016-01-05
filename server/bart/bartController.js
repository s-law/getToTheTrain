var Bart = require('./bartModel.js');
var bodyParser = require('body-parser');

module.exports = {
  allStations: function(req, res, next) {
    Bart.find({}, function(err, stations) {
      var stationList = {};

      stations.forEach(function(station) {
        stationList[station.shortname] = [station.lon, station.lat];
      });
      res.send(stationList);
    });
  },

  nearestStation: function(req, res, next) {
    // optimized Haversine formula:
    // https://stackoverflow.com/a/21623206
    var dist = function (lat1, lon1, lat2, lon2) {
      var p = 0.017453292519943295;    // Math.PI / 180
      var c = Math.cos;
      var a = 0.5 - c((lat2 - lat1) * p)/2 + 
              c(lat1 * p) * c(lat2 * p) * 
              (1 - c((lon2 - lon1) * p))/2;

      return 7918 * Math.asin(Math.sqrt(a)); // 2 * R; R = 3959 mi
    }

    var lat = req.body.lat;
    var lon = req.body.lon;

    Bart.find({}, function(err, stations) {
      var closest = stations.map(function(stn) {
        return [stn.shortname, dist(lat, lon, stn.lon, stn.lat)];
      })
      .reduce(function(a, b, i, stationList) {
        return a[1] < b[1] ? a : b;
      });

      console.log(closest);
      res.send(closest);
    });
  }
}
