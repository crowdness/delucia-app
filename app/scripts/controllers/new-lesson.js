'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:NewLessonCtrl
 * @description
 * # NewLessonCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('NewLessonCtrl', function($scope) {
        $scope.languages = [{
            code: 'en',
            name: 'English'
        }];
        $scope.lesson = {};
        $scope.video = {
            language: $scope.languages[0]
        };

        $scope.submit = function() {
            if ($scope.frm.$valid) {
                console.log($scope.lesson, $scope.video);
            }
        };
    });
