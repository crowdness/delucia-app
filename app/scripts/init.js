'use strict';

angular.module('deluciaApp')
    .run(['$rootScope', '$location', 'Auth', '$modal', 'Ref', '$firebaseArray', '_',
        function($rootScope, $location, Auth, $modal, Ref, $firebaseArray, _) {
            $rootScope.location = $location;
            $rootScope.Auth = Auth;
            
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
