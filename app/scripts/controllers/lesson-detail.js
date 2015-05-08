'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:LessonDetailCtrl
 * @description
 * # LessonDetailCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('LessonDetailCtrl', function ($scope, $location, $routeParams, Ref, $firebaseObject, $log, $http, $rootScope, $sce, URI, user) {
    $scope.uploadActionUrl = null;//$sce.trustAsResourceUrl('http://1511655194.cloud.vimeo.com/upload?ticket_id=3bfb69e0fbd47e6f3b30c81575d544ee&video_file_id=365077919&signature=f6ea951b68b2b6486c3e51f97593d9f9&v6=1&full_hd=0&redirect_url=https%3A%2F%2Fvimeo.com%2Fupload%2Fapi%3Fvideo_file_id%3D365077919%26app_id%3D51659%26ticket_id%3D3bfb69e0fbd47e6f3b30c81575d544ee%26signature%3D76357591194f7b18547f8fdd01dfa9b49552bfb0');        
    $scope.lessonId = $routeParams.lessonId;
    $scope.video_uri = $location.search().video_uri;
    var lesson = $firebaseObject(Ref.child('lessons').child($scope.lessonId));
    lesson.$loaded(function (data) {
        if (!data.title) {
            $scope.err = 'Sorry, lesson not found.';
            return;
        }
        $scope.languageCode = $routeParams.languageCode;
        if ($scope.languageCode) {
            $scope.translation = $firebaseObject(Ref.child('lessons').child($scope.lessonId).child('translations').child($scope.languageCode));
            $scope.translation.$loaded(function () {
                // avoid data flashing
                $scope.lesson = lesson;

                if ($scope.video_uri) {
                    if ($scope.translation) {
                        $scope.translation.videos = $scope.translation.videos || {};
                        $scope.translation.videos[user.uid] = 'https://player.vimeo.com' + $scope.video_uri.replace('videos', 'video');
                        $scope.translation.$save();
                    }
                    else if($scope.lesson){
                        $scope.lesson.videos = $scope.lesson.videos || {};
                        $scope.lesson.videos[user.uid] = 'https://player.vimeo.com' + $scope.video_uri.replace('videos', 'video');
                        $scope.lesson.$save();
                    }
                }
                
                $scope.videos = $scope.translation ? $scope.translation.videos : $scope.lesson.videos;
            });
        } else {
            $scope.lesson = lesson;
        }
    }, function (err) {
            $scope.err = err;
        });

    $scope.uploadForm = function uploadForm() {
        $log.log('upload');
        // check quota
        $http.post('https://api.vimeo.com/me/videos', { type: 'POST', redirect_url: $location.absUrl() }, { headers: { Authorization: 'bearer ' + $rootScope.vimeoAccessToken } })
            .success(function (data) {
            // this callback will be called asynchronously
            // when the response is available
            $log.log(data);
            $scope.uploadActionUrl = $sce.trustAsResourceUrl(data.upload_link_secure);
        })
            .error(function (data) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $log.log(data);
        });
    };
});
