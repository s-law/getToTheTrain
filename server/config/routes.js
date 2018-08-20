var bartController = require('../bart/bartController.js');
var caltrainController = require('../caltrain/caltrainController.js');
let generalController = require('../general/generalController.js');
const station = require('../station/controller.js')

module.exports = function(app, express) {
    app.get('/api/bart-stations', bartController.allStations);
    app.post('/api/bart-stations', bartController.nearestStation);
    app.get('/api/caltrain-stations', caltrainController.allStations);
    app.post('/api/caltrain-stations', caltrainController.nearestStation);
    app.get('/api/v2/general/info', generalController.info);
    app.get('/api/v2/general/systems', generalController.supportedTransitSystems);
    app.post('/api/v2/station/nearest', station.nearest);
    app.post('/api/v2/station/nearest/departures', station.nearestNextDepartures);
    app.post('/api/v2/station/departures', station.departures);
};
