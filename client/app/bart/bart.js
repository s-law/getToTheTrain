angular.module('gt3.bart', [])
.controller('BartController', function($scope, Bart) {
  $scope.data = {};
  Bart.getStations()
  .then(function(data) {
    $scope.destinations = data;
  })
})
