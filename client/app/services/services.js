angular.module('gt3.services', [])
.factory('Systems', function ($http, $q) {
  return {
    getStations: function(system) {
      return $http({
        method: 'GET',
        url: '/api/' + system + '-stations'
      })
      .then(function (res) {
        return res.data;
      })
    },
    nearestStation: function(system) {
      // promisifies getCurrentPosition()
      function getPos() {
        return $q(function(resolve, reject) {
          navigator.geolocation.getCurrentPosition(function(position) {
            position = {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            };
            resolve(position);
          }, function(err) {
            reject(err);
          }, {
            enableHighAccuracy: true, 
            maximumAge        : 0, 
            timeout           : 15000
          });
        })
      }

      return getPos().then(function(pos) {
        return $http({
          method: 'POST',
          url: '/api/' + system + '-stations',
          data: pos
        })
        .then(function (res) {
          return res.data;
        });
      });
    }
  }
});
