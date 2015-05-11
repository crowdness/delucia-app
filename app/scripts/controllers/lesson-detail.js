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
        $scope.languageCode = $routeParams.languageCode;

        var lesson = $firebaseObject(Ref.child('lessons').child($scope.lessonId));
        lesson.$loaded(function(data) {
            if (!data.title) {
                $scope.err = 'Sorry, lesson not found.';
                return;
            }
            if ($scope.languageCode && $scope.languageCode !== 'en') {
                $scope.translation = $firebaseObject(Ref.child('lessons').child($scope.lessonId).child('translations').child($scope.languageCode));
                $scope.translation.$loaded(function() {
                    // avoid data flashing
                    $scope.lesson = lesson;

                    $scope.videos = $scope.translation ? $scope.translation.videos : $scope.lesson.videos;
                });
            } else {
                $scope.lesson = lesson;
                $scope.videos = $scope.lesson.videos;
            }
        }, function(err) {
            $scope.err = err;
        });
    });
