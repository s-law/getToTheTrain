angular.module('gt3.bart', [])
.controller('BartController', function($scope, Bart) {
  Bart.nearestStation()
  .then(function(data) {
    $scope.destinations = data;
    $scope.walktime = Math.round($scope.destinations.distanceFrom * 20);
  });

  setInterval(function() {
    Bart.nearestStation()
    .then(function(data) {
      $scope.destinations = data;
      $scope.walktime = Math.round($scope.destinations.distanceFrom * 20 );
    });
  }, 30000);

  $scope.classifyTime = function(time) {
    var walkSpeed = 3;
    var runSpeed = 5;
    var howFar = $scope.destinations.distanceFrom;

    if (time > (howFar/(60/walkSpeed)) + 10) {
      return 'blue';
    } else if (time > (howFar/(60/walkSpeed)) + 5) {
      return 'green'
    } else if (time > (howFar/(60/runSpeed)) + 3) {
      return 'yellow'
    } else {
      return 'red';
    }
  };
})
