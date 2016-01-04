var Bart = require('./bartModel.js');

module.exports = {
  stations: function(req, res, next) {
    // make query here
    .then(function(stations) {
      res.json(stations);
    })
  };
}