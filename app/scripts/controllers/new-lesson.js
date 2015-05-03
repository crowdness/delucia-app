'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:NewLessonCtrl
 * @description
 * # NewLessonCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('NewLessonCtrl', function($scope, Ref, user, $location, $filter, $rootScope) {
        $scope.languages = $rootScope.languages;
        $scope.lesson = {};
        $scope.video = {
            language: $scope.languages[0]
        };

        $scope.submit = function() {
            delete $scope.err;
            if ($scope.frm.$valid) {
                $scope.lesson.author = user.uid;

                var safeTitle = $filter('safeTitle')($scope.lesson.title);
                $scope.lessonRef = Ref.child('lessons').child(safeTitle);
                $scope.lessonRef.once('value', function(snapshot) {
                    if (snapshot.exists()) {
                        $scope.err = 'Lesson already exists.';
                        return;
                    }
                    $scope.lessonRef.set($scope.lesson, function(err) {
                        if (err) {
                            $scope.err = err;
                            return;
                        }

                        $scope.video.author = user.uid;
                        $scope.video.lessonId = safeTitle;
                        $scope.video.title = $scope.lesson.title;
                        $scope.video.description = $scope.lesson.description;
                        $scope.video.languageCode = $scope.video.language.code;
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
                                    $location.path('/l/' + safeTitle + '/' + videoRef.key());
                                });
                            });
                        });
                    });
                });
            }
        };
    });
