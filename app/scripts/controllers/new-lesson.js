'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:NewLessonCtrl
 * @description
 * # NewLessonCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('NewLessonCtrl', function($scope, Ref, user, $location, $filter) {
        $scope.languages = [{
            code: 'en',
            name: 'English'
        }];
        $scope.lesson = {};
        $scope.video = {
            language: $scope.languages[0]
        };

        $scope.submit = function() {
            delete $scope.err;
            if ($scope.frm.$valid) {
                $scope.lesson.author = user.uid;
                $scope.video.author = user.uid;
                var safeTitle = $filter('safeTitle')($scope.lesson.title);

                var lessonRef = Ref.child('lessons').child(safeTitle);
                lessonRef.once('value', function(snapshot) {
                    if (snapshot.exists()) {
                        $scope.err = 'Lesson already exists.';
                        return;
                    }
                    lessonRef.set($scope.lesson, function(err) {
                        if (err) {
                            $scope.err = err;
                            return;
                        }
                        lessonRef.child('videos').push($scope.video, function(err) {
                            if (err) {
                                $scope.err = err;
                                return;
                            }
                            $scope.$apply(function() {
                                $location.path('/l/' + $filter('safeTitle')($scope.lesson.title));
                            });
                        });
                    });
                });
            }
        };
    });
