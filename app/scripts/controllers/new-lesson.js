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

                var lessonsRef = Ref.child('lessons');
                var lessonRef = lessonsRef.push($scope.lesson, function(err) {
                    if (err) {
                        $scope.err = err;
                        return;
                    }
                    var videoRef = lessonRef.child('videos').push($scope.video, function(err) {
                        if (err) {
                            $scope.err = err;
                            return;
                        }
                        lessonRef.update({
                            defaultVideoId: videoRef.key()
                        });
                        $scope.$apply(function() {
                            $location.path('/l/' + lessonRef.key() + '/' + $filter('safeTitle')($scope.lesson.title));
                        });
                    });
                });
            }
        };
    });
