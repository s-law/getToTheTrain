var Bart = require('./bartModel.js');
var utils = require('../config/utils.js');

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
    var lat = req.body.lat;
    var lon = req.body.lon;
    var bartKey = process.env.BARTKEY || 'MW9S-E7SL-26DU-VV8V';

    Bart.find({}, function(err, stations) {
      var closest = stations.map(function(stn) {
        return [stn.shortname, utils.calcDistance(lat, lon, stn.lat, stn.lon), stn.longname];
      })
      .reduce(function(a, b, i, stationList) {
        return a[1] < b[1] ? a : b;
      });

      utils.bartParse('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + closest[0] + '&key=' + bartKey, function(apiRes) {
        var destEtdObjs = apiRes['root']['station'][0]['etd'];

        var destinations = destEtdObjs.map(function(destEtdObj) {
          var destName = destEtdObj.destination[0];
          var departTimes = []
          destEtdObj.estimate.forEach(function(anEtd) {
            var time = anEtd.minutes[0];
            if (time !== 'Leaving') {
              departTimes.push(time);
            }
          });

          var destination = {};
          destination['station'] = destName;
          destination['departs'] = departTimes;

          return destination;
        });

        var destSet = {};
        destSet['closest'] = closest[2];
        destSet['destinations'] = destinations;
        destSet['distanceFrom'] = closest[1];
        res.send(destSet);
      });
    });
  }
}
