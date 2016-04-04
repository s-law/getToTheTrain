var request = require('request');
var cheerio = require('cheerio');
var parseString = require('xml2js').parseString;
var bartApiKey = require('../config/apiKeys.js').bart;

module.exports = {
  // optimized Haversine formula:
  // https://stackoverflow.com/a/21623206
  calcDistance: function (lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;

    return 7918 * Math.asin(Math.sqrt(a)); // 2 * R; R = 3959 mi
  },
  calcWalkTime: function(distance) {
    // average walking speed is 3 MPH
    // (x miles / 3 miles per hour) * 60 minutes per hour
    // future version will incorporate GMaps call
    return Math.ceil(distance * 20);
  },
  calcRunTime: function(distance) {
    // decent jogging speed is 5 MPH
    // (x miles / 5 miles per hour) * 60 minutes per hour
    // future version will incorporate GMaps call
    return Math.ceil(distance * 12);
  },
  bartParse: function(stationShortName, cb) {
    var requestUrl = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + stationShortName + '&key=' + bartApiKey;
    request(requestUrl, function(err, res, xml) {
      parseString(xml, function(err, result) {
        cb(result);
      });
    });
  },
  caltrainParse: function(stationWebName, cb) {
    var requestUrl = 'http://www.caltrain.com/schedules/realtime/stations/' + stationWebName + '-mobile.html';
    request(requestUrl, function(err, res, body) {
      var result = {
        south: {
          "Local": null,
          "Limited": null,
          "Baby Bullet": null
        },
        north: {
          "Local": null,
          "Limited": null,
          "Baby Bullet": null
        }
      };
      var $ = cheerio.load(body);
      var $directionHeader = $('#ipsttrains .ipf-st-ip-trains-table-dir-tr');
      var numberOfDirections = $directionHeader.children().length;

      for (var direction = 0; direction < numberOfDirections; direction++) {
        var directionInitial = $directionHeader.children().eq(direction).children().html().charAt(0);

        // Selects the rows of the table for a given direction
        $('#ipsttrains .ipf-st-ip-trains-subtable').eq(direction).children().each(function() {
          $(this).children().each(function() {
            console.log($(this).html())
          });
        });
      }

      cb(result);
    });
  }
}