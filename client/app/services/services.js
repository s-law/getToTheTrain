angular.module('shortly.services', [])
.factory('Bart', function ($http) {
  return {
    getStations: function() {
      return $http({
        method: 'GET',
        url: '/api/stations'
      })
      .then(function (res) {
        return res.data;
      })
    };
  }
})