'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:AmendLessonCtrl
 * @description
 * # AmendLessonCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('AmendLessonCtrl', function($scope, Ref, $firebaseObject, $routeParams, user, $location) {
        $scope.languages = [{
            code: 'en',
            name: 'English'
        }, {
            code: 'es',
            name: 'Spanish'
        }, {
            code: 'sr',
            name: 'Serbian'
        }];
        $scope.video = {
            language: $scope.languages[0]
        };

        $scope.lessonRef = Ref.child('lessons').child($routeParams.lessonId);
        $scope.lesson = $firebaseObject($scope.lessonRef);

        $scope.submit = function() {
            delete $scope.err;
            if ($scope.frm.$valid) {
                $scope.video.author = user.uid;
                $scope.video.lessonId = $scope.lesson.$id;
                $scope.video.title = $scope.video.title || $scope.lesson.title;
                $scope.video.description = $scope.video.description || $scope.lesson.description;

                var videoRef = Ref.child('videos').push($scope.video, function(err) {
                    if (err) {
                        $scope.err = err;
                        return;
                    }
                    $scope.lessonRef.child('videos').child(videoRef.key()).set($scope.video, function(err) {
                        if (err) {
                            $scope.err = err;
                            return;
                        }
                        $scope.$apply(function() {
                            $location.path('/l/' + $scope.lesson.$id + '/' + videoRef.key());
                        });
                    });
                });
            }
        };
    });
