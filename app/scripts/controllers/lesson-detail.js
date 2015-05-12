'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:LessonDetailCtrl
 * @description
 * # LessonDetailCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('LessonDetailCtrl', function($scope, $location, $routeParams, Ref, $firebaseObject, _) {
        $scope.lessonId = $routeParams.lessonId;
        $scope.languageCode = $routeParams.languageCode;
        $scope.activeVideo = $location.hash();

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
                    if ($scope.activeVideo === '' && $scope.videos && Object.keys($scope.videos).length) {
                        $scope.activeVideo = $scope.videos[Object.keys($scope.videos)[0]].videoId;
                        $location.hash($scope.activeVideo);
                    }
                });
            } else {
                $scope.lesson = lesson;
                $scope.videos = $scope.lesson.videos;
                if ($scope.activeVideo === '' && $scope.videos && Object.keys($scope.videos).length) {
                    $scope.activeVideo = $scope.videos[Object.keys($scope.videos)[0]].videoId;
                    $location.hash($scope.activeVideo);
                }
            }
        }, function(err) {
            $scope.err = err;
        });

        $scope.propCount = function(obj) {
            if (!obj) {
                return 0;
            }

            return Object.keys(obj).length;
        };

        $scope.isActive = function(video) {
            return video.videoId === $scope.activeVideo;
        };

        $scope.previous = function(){
            var currIndex = _.pluck($scope.videos, 'videoId').indexOf($scope.activeVideo);
            currIndex--;
            currIndex = currIndex < 0 ? 0 : currIndex;
            return _.pluck($scope.videos, 'videoId')[currIndex];
        };

        $scope.next = function(){
            var currIndex = _.pluck($scope.videos, 'videoId').indexOf($scope.activeVideo);
            currIndex++;
            currIndex = currIndex > _.pluck($scope.videos, 'videoId').length - 1 ? _.pluck($scope.videos, 'videoId').length - 1 : currIndex;
            return _.pluck($scope.videos, 'videoId')[currIndex];
        };

        $scope.videoIndex = function(){
            return _.pluck($scope.videos, 'videoId').indexOf($scope.activeVideo) + 1;
        };
    });
