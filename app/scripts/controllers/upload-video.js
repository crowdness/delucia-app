'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:UploadVideoCtrl
 * @description
 * # UploadVideoCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('UploadVideoCtrl', function($scope, $routeParams, Ref, $firebaseObject, $log, $rootScope, $location, $http, $sce, URI) {
        $scope.lessonId = $routeParams.lessonId;
        $scope.languageCode = $routeParams.languageCode;

        if ($scope.languageCode === 'en') {
            $scope.lesson = $firebaseObject(Ref.child('lessons').child($scope.lessonId));
        } else {
            $scope.lesson = $firebaseObject(Ref.child('lessons').child($scope.lessonId).child('translations').child($scope.languageCode));
        }

        $http.post('https://api.vimeo.com/me/videos', {
                type: 'POST',
                redirect_url: URI($location.absUrl()).search('').toString() + '/callback'
            }, {
                headers: {
                    Authorization: 'bearer ' + $rootScope.vimeoAccessToken
                }
            })
            .success(function(data) {
                // this callback will be called asynchronously
                // when the response is available
                $log.log(data);
                $scope.uploadActionUrl = $sce.trustAsResourceUrl(data.upload_link_secure);
            })
            .error(function(data) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $log.log(data);
            });
    });
