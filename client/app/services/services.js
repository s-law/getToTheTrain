angular.module('shortly.services', [])
.factory('Bart', function ($http) {
  return {
    getStations: function() {
      return $http({
        method: 'GET',
        url: '/api/bart-stations'
      })
      .then(function (res) {
        return res.data;
      })
    };
  }
});
