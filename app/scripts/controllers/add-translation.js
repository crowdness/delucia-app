'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:AddTranslationCtrl
 * @description
 * # AddTranslationCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('AddTranslationCtrl', function($scope, Ref, $firebaseObject, $routeParams, user, $location, $rootScope, _, Firebase) {
        $scope.parentLessonRef = Ref.child('lessons').child($routeParams.lessonId);
        $scope.parentLesson = $firebaseObject($scope.parentLessonRef);
        $scope.parentLesson.$loaded(function() {
            $scope.languages = _.filter($rootScope.languages, function(lang) {
                if (_.contains(_.keys($scope.parentLesson.translations), lang.code) || lang.code === 'en') {
                    return false;
                } else {
                    return true;
                }
            });

            if ($scope.languages.length) {
                $scope.lesson = {
                    language: $scope.languages[0],
                    languageCode: $scope.languages[0].code
                };
            }
        });

        $scope.submit = function() {
            delete $scope.err;
            if ($scope.frm.$valid) {
                $scope.lesson.author = user.uid;
                $scope.lesson.parentId = $scope.parentLesson.$id;
                $scope.lesson.languageCode = $scope.lesson.language.code;
                $scope.lesson.language = angular.copy($scope.lesson.language);

                $scope.lesson.createdAt = Firebase.ServerValue.TIMESTAMP;
                Ref.child('lessons').push($scope.lesson, function(err) {
                    if (err) {
                        $scope.err = err;
                        return;
                    }

                    $scope.parentLessonRef.child('translations').child($scope.lesson.languageCode).set($scope.lesson);
                    $scope.$apply(function() {
                        $location.path('/l/' + $scope.parentLesson.$id + '/' + $scope.lesson.languageCode);
                    });
                });
            }
        };
    });
