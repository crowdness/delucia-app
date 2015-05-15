'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:UploadVideoCallbackCtrl
 * @description
 * # UploadVideoCallbackCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('UploadVideoCallbackCtrl', function($scope, $routeParams, Ref, $firebaseObject, $log, $location, user, $http, $rootScope) {
        $scope.error = $location.search().error;
        $scope.error_description = $location.search().error_description;
        if ($scope.error_description) {
            return;
        }

        $scope.lessonId = $routeParams.lessonId;
        $scope.languageCode = $routeParams.languageCode;
        $scope.video_uri = $location.search().video_uri;

        if ($scope.languageCode === 'en') {
            $scope.lesson = $firebaseObject(Ref.child('lessons').child($scope.lessonId));
        } else {
            $scope.lesson = $firebaseObject(Ref.child('lessons').child($scope.lessonId).child('translations').child($scope.languageCode));
        }


        $scope.lesson.$loaded(function() {
            $log.log($scope.lesson);

            var videoObj = {
                videoUri: $scope.video_uri,
                videoId: $scope.video_uri.replace('/videos/', ''),
                embedUrl: 'https://player.vimeo.com' + $scope.video_uri.replace('videos', 'video'),
                userDisplayName: user[user.provider].displayName,
                videoName: $scope.lesson.title + ' by ' + user[user.provider].displayName
            };

            $http.patch('https://api.vimeo.com/videos/' + videoObj.videoId, {
                    name: videoObj.videoName
                }, {
                    headers: {
                        Authorization: 'bearer ' + $rootScope.vimeoAccessToken
                    }
                })
                .success(function(data) {
                    $log.log(data);

                    $scope.lesson.videos = $scope.lesson.videos || {};
                    $scope.lesson.videos[user.uid] = videoObj;
                    $scope.lesson.$save().then(function() {
                        $location.url('/l/' + $scope.lessonId + '/' + $scope.languageCode + '#' + videoObj.videoId);
                    });
                })
                .error(function(data) {
                    $log.log(data);
                });
        });
    });
