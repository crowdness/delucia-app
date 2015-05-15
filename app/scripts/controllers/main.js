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
    $scope.lessons = $firebaseArray(Ref.child('lessons').orderByChild('createdAt').limitToLast(25));
  });
