var utils = require('../config/utils.js');

module.exports = {
    supportedTransitSystems: function(req, res, next) {
        let systems = ['bart', 'caltrain', 'smart'];

        res.send(systems);
    }
}
