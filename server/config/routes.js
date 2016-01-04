var bartController = require('../bart/bartController.js');

module.exports = function(app, express) {
  app.get('/api/bart-stations', bartController.allStations);
  app.post('/api/bart-stations', bartController.nearestStation);
};
