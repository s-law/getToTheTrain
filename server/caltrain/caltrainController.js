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

      // Scraping is necessary because:
      // 1. Trains of the same service type frequently do not have the same stops
      // 2. Caltrain does not provide its own API
      // 3. 511.org's API does not include train numbers
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
        var $directionHeaders = $('#ipsttrains .ipf-st-ip-trains-table-dir-tr').children();
        var numberOfDirections = $directionHeaders.length;

        for (var direction = 0; direction < numberOfDirections; direction++) {
          var trainDirection = $directionHeaders.eq(direction).children().text().substring(0,5).toLowerCase();

          // Selects the rows of the table for a given direction
          $('#ipsttrains .ipf-st-ip-trains-subtable').eq(direction).children().each(function() {
            // Extracts the text from each cell. Unfortunately .text() doesn't accept
            // a delimiter, or else this bit would be much simpler. Current order of cells
            // is train number, service type, and estimated time until departure
            var trainListing = $(this).children().map(function() {
                                  return ($(this).text());
                                }).toArray();
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
