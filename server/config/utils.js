var request = require('request');
var parseString = require('xml2js').parseString;

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
  bartParse: function(url, cb) {
    request(url, function(err, res, xml) {
      parseString(xml, function(err, result) {
        cb(result);
      });
    });
  }
}