'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
  .controller('SearchCtrl', function ($scope, $routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.q = $routeParams.q;
    $scope.langCode = $routeParams.lang;
  });
