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

    // future version will split East Bay and peninsula stations
    // into separate collections to reduce query time
    Bart.find({}, function(err, stations) {
      var closest = stations.map(function(stn) {
        return [stn.shortname, utils.calcDistance(lat, lon, stn.lat, stn.lon), stn.longname];
      })
      .reduce(function(a, b, i, stationList) {
        return a[1] < b[1] ? a : b;
      });

      utils.bartParse(closest[0], function(bartApiData) {
        var destEtdObjs = bartApiData['root']['station'][0]['etd'];

        var destinations = destEtdObjs.map(function(destEtdObj) {
          var destName = destEtdObj.destination[0];
          var departTimes = [];
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
        destSet['distanceFrom'] = +closest[1].toFixed(2);
        destSet['walkTime'] = utils.calcWalkTime(closest[1]);
        destSet['runTime'] = utils.calcRunTime(closest[1]);
        destSet['destinations'] = destinations;
        res.send(destSet);
      });
    });
  }
}
