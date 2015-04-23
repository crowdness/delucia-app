'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
  .controller('MainCtrl', function ($scope, Ref, $firebaseArray) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.lessons = $firebaseArray(Ref.child('lessons'));
  });
