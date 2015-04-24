'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:AmendLessonCtrl
 * @description
 * # AmendLessonCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('AmendLessonCtrl', function($scope, Ref, $firebaseObject, $routeParams) {
        $scope.languages = [{
            code: 'en',
            name: 'English'
        }, {
            code: 'es',
            name: 'Spanish'
        }];
        $scope.video = {
            language: $scope.languages[0]
        };

        $scope.lesson = $firebaseObject(Ref.child('lessons').child($routeParams.lessonId));

        $scope.submit = function() {
            delete $scope.err;
            if ($scope.frm.$valid) {
            	window.alert('submitted');
            }
        };
    });
