angular.module('gt3.bart', [])
.controller('BartController', function($scope, Bart) {
  Bart.nearestStation()
  .then(function(data) {
    console.log(data);
    $scope.destinations = data;
  });
})
