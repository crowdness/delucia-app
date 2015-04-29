'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('SearchCtrl', function($scope, $routeParams, Ref, $firebaseArray, $rootScope, _) {
        $scope.q = $routeParams.q;
        $scope.lang = _.find($rootScope.languages, {
            'code': $routeParams.lang
        });

        $scope.lessons = $firebaseArray(Ref.child('videos').orderByChild('languageCode').equalTo($scope.lang.code));

        $scope.filterFunction = function(item) {
            return item.title.toLowerCase().indexOf($routeParams.q.toLowerCase().trim()) > -1 ? true : false;
        };
    });
