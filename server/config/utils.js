var request = require('request');
var parseString = require('xml2js').parseString;
var bartApiKey = require('../config/apiKeys.js').bart;
const cache = require('../station/cache.js');

let supportedSystems = {
    default: ['bart'],
    mobile: ['bart', 'caltrain'],
    web: ['bart', 'caltrain'],
    nextGen: ['bart', 'caltrain', 'mbs', 'smart']
};

module.exports = {
    calcDistance: calcDistance,
    calcWalkTime: calcWalkTime,
    calcRunTime: calcRunTime,
    bartParse: bartParse,
    bartJson: bartJson,
    caltrainScrape: caltrainScrape,
    supportedSystems: supportedSystems
};

function calcDistance(lat1, lon1, lat2, lon2) {
    // optimized Haversine formula:
    // https://stackoverflow.com/a/21623206
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return 7918 * Math.asin(Math.sqrt(a)); // 2 * R; R = 3959 mi
}

function calcWalkTime(distance) {
    // average walking speed is 3 MPH
    // (x miles / 3 miles per hour) * 60 minutes per hour
    // future version will incorporate GMaps call
    return Math.ceil(distance * 20);
}

function calcRunTime(distance) {
    // decent jogging speed is 5 MPH
    // (x miles / 5 miles per hour) * 60 minutes per hour
    // future version will incorporate GMaps call
    return Math.ceil(distance * 12);
}

function bartParse(stationShortName, cb) {
    // todo: if current time is outside of operating hours, cb(null)
    var requestUrl = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + stationShortName + '&key=' + bartApiKey;
    request(requestUrl, function(err, res, xml) {
        parseString(xml, function(err, result) {
            cb(result);
        });
    });
}

function bartJson(stationShortName, requestTime, cb) {
    // todo: if current time is outside of operating hours, cb(null)
    if (!cache.bart.hasOwnProperty(stationShortName) || requestTime - cache.bart[stationShortName].lastRequestedTime > 54000) {
        const requestUrl = 'https://api.bart.gov/api/etd.aspx?cmd=etd&orig=' + stationShortName + '&key=' + bartApiKey + "&json=y";

        request(requestUrl, function(err, res, body) {
            cache.bart[stationShortName] = {
                response: body,
                lastRequestedTime: requestTime
            };

            cb(body, false);
        });
    } else {
        cb(cache.bart[stationShortName].response, true);
    }
}

function caltrainScrape(stationWebName, cb) {
// todo: if current time is outside of operating hours, cb(null)
    var requestUrl = 'http://www.caltrain.com/schedules/realtime/stations/' + stationWebName + '-mobile.html';
    request(requestUrl, function(err, res, body) {
        cb(body);
    });
}
