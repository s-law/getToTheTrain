var bartController = require('../bart/bartController.js');
var caltrainController = require('../caltrain/caltrainController.js');
let generalController = require('../general/generalController.js');

module.exports = function(app, express) {
  app.get('/api/bart-stations', bartController.allStations);
  app.post('/api/bart-stations', bartController.nearestStation);
  app.get('/api/caltrain-stations', caltrainController.allStations);
  app.post('/api/caltrain-stations', caltrainController.nearestStation);
  app.get('/api/v2/general/systems', generalController.supportedTransitSystems);
};
