angular.module('gt3.bart', [])
.controller('BartController', function($scope, Systems) {
  Systems.nearestStation("bart")
  .then(function(nearestStationData) {
    $scope.nearestStationData = nearestStationData;
  });

  setInterval(function() {
    Systems.nearestStation("bart")
    .then(function(nearestStationData) {
      $scope.nearestStationData = nearestStationData;
    });
  }, 30000);

  $scope.classifyTime = function(time) {
    var walkTime = $scope.nearestStationData.walkTime;
    var runTime = $scope.nearestStationData.runTime;

    if (time > walkTime + 7) {
      return 'blue';
    } else if (time > walkTime + 4) {
      return 'green'
    } else if (time > runTime + 2.5) {
      return 'yellow'
    } else {
      return 'red';
    }
  };
});
