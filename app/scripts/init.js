'use strict';

angular.module('deluciaApp')
    .run(['$rootScope', '$location', 'Auth', '$modal', 'Ref', '$firebaseArray', '_', '$q',
        function($rootScope, $location, Auth, $modal, Ref, $firebaseArray, _, $q) {
            $rootScope.location = $location;
            $rootScope.Auth = Auth;
            $rootScope.showSearchDialog = function() {
                $modal.open({
                    templateUrl: 'views/search-modal.html'
                });
            };
            $rootScope.search = function(q, lang) {
                $location.path('/search').search({
                    q: q,
                    lang: lang.code
                });
            };
            $rootScope.searchVideos = function(lang, q) {
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
            $rootScope.goToVideo = function(item) {
                $location.url('/l/' + (item.parentId || item.$id) + '/' + item.languageCode);
            };

            $rootScope.languages = [{
                code: 'en',
                name: 'English'
            }];
            var tempLanguages = $firebaseArray(Ref.child('languages'));
            tempLanguages.$loaded(function() {
                $rootScope.languages = _.map(tempLanguages, function(lang) {
                    return {
                        code: lang.$id,
                        name: lang.$value
                    };
                });
            });

            $rootScope.vimeoAccessToken = '3ddd650c8a4657c2cde8174fe91024ca';

            $rootScope.Utils = {
                keys: Object.keys
            };
        }
    ])
    .constant('URI', window.URI)
    .constant('_', window._);
