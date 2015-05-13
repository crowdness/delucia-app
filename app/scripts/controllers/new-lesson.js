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
        $scope.lesson = {
            language: {
                code: 'en',
                name: 'English'
            },
            languageCode: 'en'
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

                        $scope.$apply(function() {
                            $location.path('/l/' + safeTitle + '/en');
                        });
                    });
                });
            }
        };
    });
