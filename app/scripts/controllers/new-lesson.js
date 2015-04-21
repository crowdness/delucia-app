'use strict';

/**
 * @ngdoc function
 * @name deluciaApp.controller:NewLessonCtrl
 * @description
 * # NewLessonCtrl
 * Controller of the deluciaApp
 */
angular.module('deluciaApp')
    .controller('NewLessonCtrl', function($scope, Ref, user) {
        $scope.languages = [{
            code: 'en',
            name: 'English'
        }];
        $scope.lesson = {};
        $scope.video = {
            language: $scope.languages[0]
        };

        $scope.submit = function() {
            if ($scope.frm.$valid) {
                $scope.lesson.author = user.uid;
                $scope.video.author = user.uid;
                
                console.log($scope.lesson, $scope.video);
                var lessonsRef = Ref.child('lessons');
                var lessonRef = lessonsRef.push($scope.lesson, function(err){
                    if(err){
                        window.alert(err);
                        return;
                    }
                    console.log(lessonRef);
                    lessonRef.child('videos').push($scope.video, function(err){
                        if(err){
                            window.alert(err);
                            return;
                        }
                        window.alert('success');
                    });
                });
            }
        };
    });
