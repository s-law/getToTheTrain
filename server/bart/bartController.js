var Bart = require('./bartModel.js');
var utils = require('../config/utils.js');
var stations = require('../station/list.js');

module.exports = {
    determineClosestStation: determineClosestStation,
    allStations: function(req, res, next) {
        Bart.find({}, function(err, stations) {
            var stationList = {};

            stations.forEach(function(station) {
                stationList[station.shortname] = [station.lon, station.lat];
            });
            res.send(stationList);
        });
    },

    nearestStation: function(req, res, next) {
        var lat = req.body.lat;
        var lon = req.body.lon;

        // future version will split East Bay and peninsula stations
        // into separate collections to reduce query time
        Bart.find({}, function(err, stations) {
            var closest = stations.map(function(stn) {
                return [stn.shortname, utils.calcDistance(lat, lon, stn.lat, stn.lon), stn.longname];
            })
            .reduce(function(a, b, i, stationList) {
                return a[1] < b[1] ? a : b;
            });

            utils.bartParse(closest[0], function(bartApiData) {
                var trainDepartures = {
                    closestStation: closest[2],
                    distanceFrom: +closest[1].toFixed(2),
                    walkTime: utils.calcWalkTime(closest[1]),
                    runTime: utils.calcRunTime(closest[1]),
                    destinations: []
                };

                if (bartApiData !== null && bartApiData['root']['message'][0] === '') {
                    var destEtdObjs = bartApiData['root']['station'][0]['etd'];

                    // this populates trainDepartures.destinations
                    destEtdObjs.forEach(function(destEtdObj) {
                        var destination = {
                            station: destEtdObj.destination[0],
                            departs: []
                        };

                        destEtdObj.estimate.forEach(function(anEtd) {
                            var time = anEtd.minutes[0];
                            if (time !== 'Leaving') {
                                destination.departs.push(time);
                            }
                        }); 

                        trainDepartures.destinations.push(destination);
                    });
                }

                res.send(trainDepartures);
            });
        });
    }
};

function determineClosestStation(lat, lon) {
    const stationSet = lon < -122.36 ? 'west' : 'east';
    const regionalBartStations = stations.bart[stationSet];

    const closestBartStation = regionalBartStations.map(function(station) {
        return {
            shortname: station.shortname,
            longname: station.longname,
            distance: utils.calcDistance(lat, lon, station.lat, station.lon)
        };
    })
    .reduce(function(stationA, stationB) {
        return stationA.distance < stationB.distance ? stationA : stationB;
    });

    return closestBartStation;
}
