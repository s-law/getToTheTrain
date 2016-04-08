angular.module('gt3.caltrain', [])
.controller('CaltrainController', function($scope, Systems) {
  Systems.nearestStation("caltrain")
  .then(function(nearestStationData) {
    console.log(JSON.stringify(nearestStationData));
    $scope.nearestStationData = nearestStationData;
  });

  setInterval(function() {
    Systems.nearestStation("caltrain")
    .then(function(nearestStationData) {
      $scope.nearestStationData = nearestStationData;
    });
  }, 30000);

  $scope.classifyTime = function(time) {
    var walkTime = $scope.nearestStationData.walkTime;
    var runTime = $scope.nearestStationData.runTime;

    if (time > walkTime + 6) {
      return 'blue';
    } else if (time > walkTime + 3) {
      return 'green'
    } else if (time > runTime + 2) {
      return 'yellow'
    } else {
      return 'red';
    }
  };
});
