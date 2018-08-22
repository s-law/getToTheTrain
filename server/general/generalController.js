var utils = require('../config/utils.js');

module.exports = {
    info: function(req, res, next) {
        const info = {
            blockAccess: false,
            updateAvailable: false,
            detailedMessageAvailable: true,
            message: "Hi!",
            version: 1
        }

        res.send(info);
    },
    supportedTransitSystems: function(req, res, next) {
        const clientType = req.query.client;
        const supportedSystems = clientType && utils.supportedSystems.hasOwnProperty(clientType) ?
            utils.supportedSystems[clientType] : utils.supportedSystems.default;

        res.send(supportedSystems);
    }
}
