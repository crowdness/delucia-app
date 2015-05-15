'use strict';
/**
 * @ngdoc function
 * @name deluciaApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('deluciaApp')
    .controller('LoginCtrl', function($scope, Auth, $location, $q, Ref, $timeout, $log) {
        $scope.oauthLogin = function(provider) {
            $scope.err = null;
            Auth.$authWithOAuthPopup(provider, {
                    rememberMe: true
                })
                .then(createProfile)
                .then(redirect, showError);
        };

        $scope.anonymousLogin = function() {
            $scope.err = null;
            Auth.$authAnonymously({
                rememberMe: true
            }).then(redirect, showError);
        };

        $scope.passwordLogin = function(email, pass) {
            $scope.err = null;
            $scope.frm.submitted = true;
            if ($scope.frm.$valid) {
                $scope.frm.submitted = false;

                Auth.$authWithPassword({
                    email: email,
                    password: pass
                }, {
                    rememberMe: true
                }).then(
                    redirect, showError
                );
            }
        };

        $scope.createAccount = function(email, pass) {
            $scope.err = null;
            $scope.frm.submitted = true;
            if ($scope.frm.$valid) {
                $scope.frm.submitted = false;
                Auth.$createUser({
                        email: email,
                        password: pass
                    })
                    .then(function() {
                        // authenticate so we have permission to write to Firebase
                        return Auth.$authWithPassword({
                            email: email,
                            password: pass
                        }, {
                            rememberMe: true
                        });
                    })
                    .then(createProfile)
                    .then(redirect, showError);
            }
        };

        // find a suitable name based on the meta info given by each provider
        function getName(authData) {
            switch (authData.provider) {
                case 'password':
                    return authData.password.email.replace(/@.*/, '');
                case 'twitter':
                    return authData.twitter.displayName;
                case 'facebook':
                    return authData.facebook.displayName;
                case 'google':
                    return authData.google.displayName;
            }
        }

        function createProfile(user) {
            $log.log(user);
            var ref = Ref.child('users').child(user.uid),
                def = $q.defer();
            ref.set({
                displayName: ref.displayName || getName(user)
            }, function(err) {
                $timeout(function() {
                    if (err) {
                        def.reject(err);
                    } else {
                        def.resolve(ref);
                    }
                });
            });
            return def.promise;
        }

        // function firstPartOfEmail(email) {
        //     return ucfirst(email.substr(0, email.indexOf('@')) || '');
        // }

        // function ucfirst(str) {
        //     // inspired by: http://kevin.vanzonneveld.net
        //     str += '';
        //     var f = str.charAt(0).toUpperCase();
        //     return f + str.substr(1);
        // }



        function redirect() {
            $location.path('/account');
        }

        function showError(err) {
            $scope.err = err;
            throw new Error();
        }


    });
