'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:LessonDetailCtrl
 * @description
 * # LessonDetailCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('LessonDetailCtrl', function($scope, $location, $routeParams, Ref, $firebaseObject) {
        $scope.lessonId = $routeParams.lessonId;
        $scope.lesson = $firebaseObject(Ref.child('lessons').child($scope.lessonId));
        $scope.lesson.$loaded(function(data) {
            if (!data.title) {
                $scope.err = 'Sorry, lesson not found.';
                return;
            }
            $scope.videoId = $routeParams.videoId;
            if ($scope.videoId) {
                $scope.video = $firebaseObject(Ref.child('lessons').child($scope.lessonId).child('videos').child($scope.videoId));
            }
        }, function(err) {
            $scope.err = err;
        });
    });
