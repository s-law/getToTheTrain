var Caltrain = require('./caltrainModel.js');
var utils = require('../config/utils.js');
var cheerio = require('cheerio');

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

      utils.caltrainScrape(closest[0], function(caltrainHTML) {
        var trainDepartures = {
          closestStation: closest[2],
          distanceFrom: +closest[1].toFixed(2),
          walkTime: utils.calcWalkTime(closest[1]),
          runTime: utils.calcRunTime(closest[1]),
          south: {
            'Local': [],
            'Limited': [],
            'Baby Bullet': []
          },
          north: {
            'Local': [],
            'Limited': [],
            'Baby Bullet': []
          }
        };
        var $ = cheerio.load(caltrainHTML);
        var $directionHeader = $('#ipsttrains .ipf-st-ip-trains-table-dir-tr');
        var numberOfDirections = $directionHeader.children().length;

        for (var direction = 0; direction < numberOfDirections; direction++) {
          var trainDirection = $directionHeader.children().eq(direction).children().html().substring(0,5).toLowerCase();
          var trainListing = [];

          // Selects the rows of the table for a given direction
          $('#ipsttrains .ipf-st-ip-trains-subtable').eq(direction).children().each(function() {
            $(this).children().each(function() {
              trainListing.push($(this).html());
            });
            trainDepartures[trainDirection][trainListing[1]].push({
              trainNumber: trainListing[0],
              timeToDepart: parseInt(trainListing[2])
            });
          });
        }

        res.send(trainDepartures);
      });
    });
  }
}
