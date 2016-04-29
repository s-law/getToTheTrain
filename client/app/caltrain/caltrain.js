angular.module('gt3.caltrain', [])
.controller('CaltrainController', function($scope, Systems) {
  $scope.directions = ["north", "south"];
  $scope.hasLoaded = false;
  Systems.nearestStation("caltrain")
  .then(function(nearestStationData) {
    provideTrainServices(nearestStationData);
    $scope.nearestStationData = nearestStationData;
    $scope.hasLoaded = true;
  });

  setInterval(function() {
    Systems.nearestStation("caltrain")
    .then(function(nearestStationData) {
      provideTrainServices(nearestStationData);
      $scope.nearestStationData = nearestStationData;
    });
  }, 30000);

  var provideTrainServices = function(trainData) {
    trainData.northServices = Object.keys(trainData.north);
    trainData.southServices = Object.keys(trainData.south);
  }

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

  $scope.areTrainsAvailable = function(serviceDirection, serviceType) {
    if (!$scope.hasLoaded) {
      return false;
    }
    if (serviceType) {
      return !!$scope.nearestStationData[serviceDirection][serviceType].length;
    } else {
      var numberOfTrains = 0;
      for (var trainService in $scope.nearestStationData[serviceDirection]) {
        numberOfTrains += trainService.length;
      }
      return !!numberOfTrains;
    }
  };
});
