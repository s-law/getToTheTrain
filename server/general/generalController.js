var utils = require('../config/utils.js');

module.exports = {
    info: function(req, res, next) {
        const info = {
            updateRequired: false,
            showMessage: false,
            version: 1,
            message: "Hi!"
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
