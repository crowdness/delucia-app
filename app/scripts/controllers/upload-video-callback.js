'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:UploadVideoCallbackCtrl
 * @description
 * # UploadVideoCallbackCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('UploadVideoCallbackCtrl', function($scope, $routeParams, Ref, $firebaseObject, $log, $location, user) {
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

            $scope.lesson.videos = $scope.lesson.videos || {};
            var videoObj = {
                videoUri: $scope.video_uri,
                videoId: $scope.video_uri.replace('/videos/', ''),
                embedUrl: 'https://player.vimeo.com' + $scope.video_uri.replace('videos', 'video')
            };
            $scope.lesson.videos[user.uid] = videoObj;
            $scope.lesson.$save().then(function() {
                $location.url('/l/' + $scope.lessonId + '/' + $scope.languageCode + '#' + videoObj.videoId);
            });
        });
    });
