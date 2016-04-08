angular.module('gt3', [
  'gt3.bart',
  'gt3.caltrain',
  'gt3.services',
  'ngRoute'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/bart', {
      templateUrl: 'app/bart/bart.html',
      controller: 'BartController'
    })
    .when('/caltrain', {
      templateUrl: 'app/caltrain/caltrain.html',
      controller: 'CaltrainController'
    })
    .otherwise({
      redirectTo: "/bart"
    });
})
