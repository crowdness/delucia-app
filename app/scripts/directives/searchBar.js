'use strict';

/**
 * @ngdoc directive
 * @name deluciaApp.directive:searchBar
 * @description
 * # searchBar
 */
angular.module('deluciaApp')
    .directive('searchBar', function($rootScope, $q, $firebaseArray, Ref, _, $location) {
        return {
            templateUrl: 'views/_searchBar.html',
            restrict: 'E',
            scope: {},
            link: function(scope) {
                scope.searchLang = $rootScope.languages[0];

                scope.selectLang = function(lang) {
                    scope.searchLang = lang;
                    scope.searchQuery = '';
                };

                scope.searchVideos = function(lang, q) {
                    q = q.toLowerCase();
                    var deferred = $q.defer();

                    $firebaseArray(Ref.child('lessons').orderByChild('languageCode').equalTo(lang.code)).$loaded(function(lessons) {
                        deferred.resolve(_.filter(lessons, function(video) {
                            return video.title.toLowerCase().indexOf(q) > -1;
                        }));
                    });

                    return deferred.promise.then(function(lessons) {
                        return lessons;
                    });
                };


                scope.goToVideo = function(item) {
                    scope.searchQuery = '';
                    $location.url('/l/' + (item.parentId || item.$id) + '/' + item.languageCode);
                };
            }
        };
    });
