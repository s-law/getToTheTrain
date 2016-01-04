angular.module('gt3', [
  'gt3.bart',
  'ngRoute'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/bart', {
      templateUrl: 'app/bart/bart.html',
      controller: 'BartController'
    })
    .otherwise({
      redirectTo: '/bart'
    });
})
