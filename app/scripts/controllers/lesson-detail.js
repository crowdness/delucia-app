'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:LessonDetailCtrl
 * @description
 * # LessonDetailCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('LessonDetailCtrl', function($scope, $location, $routeParams, Ref, $firebaseObject, $log, $http, $rootScope) {
        $scope.lessonId = $routeParams.lessonId;
        var lesson = $firebaseObject(Ref.child('lessons').child($scope.lessonId));
        lesson.$loaded(function(data) {
            if (!data.title) {
                $scope.err = 'Sorry, lesson not found.';
                return;
            }
            $scope.languageCode = $routeParams.languageCode;
            if ($scope.languageCode) {
                $scope.translation = $firebaseObject(Ref.child('lessons').child($scope.lessonId).child('translations').child($scope.languageCode));
                $scope.translation.$loaded(function() {
                    // avoid data flashing
                    $scope.lesson = lesson;
                });
            } else {
                $scope.lesson = lesson;
            }
        }, function(err) {
            $scope.err = err;
        });
        
        $scope.uploadForm = function uploadForm() {
            $log.log('upload');
            $http.post('https://api.vimeo.com/me/videos', { type: 'POST' }, { headers: { Authorization : 'bearer ' + $rootScope.vimeoAccessToken } })
              .success(function(data) {
                // this callback will be called asynchronously
                // when the response is available
                $log.log(data);
              })
              .error(function(data) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $log.log(data);
              });
        };
    });
