'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('deluciaApp')
    .controller('AccountCtrl', function($scope, user, Auth, Ref, $firebaseObject, $timeout) {
        $scope.user = user;
        $scope.logout = function() {
            Auth.$unauth();
        };
        $scope.messages = [];
        var profileRef = Ref.child('users').child(user.uid);
        var profile = $scope.profile = $firebaseObject(profileRef);
        //profile.$bindTo($scope, 'profile');

        $scope.updateProfile = function() {
            $scope.profileForm.submitted = true;
            if ($scope.profileForm.$valid) {
                $scope.profileForm.submitted = false;
                $scope.profile.$save();
            }
        };

        $scope.changePassword = function(oldPass, newPass, confirm) {
            $scope.err = null;
            if (!oldPass || !newPass) {
                error('Please enter all fields');
            } else if (newPass !== confirm) {
                error('Passwords do not match');
            } else {
                Auth.$changePassword({
                        email: profile.email,
                        oldPassword: oldPass,
                        newPassword: newPass
                    })
                    .then(function() {
                        success('Password changed');
                    }, error);
            }
        };

        $scope.changeEmail = function(pass, newEmail) {
            $scope.err = null;
            Auth.$changeEmail({
                    password: pass,
                    newEmail: newEmail,
                    oldEmail: profile.email
                })
                .then(function() {
                    profile.email = newEmail;
                    profile.$save();
                    success('Email changed');
                })
                .catch(error);
        };

        function error(err) {
            alert(err, 'danger');
        }

        function success(msg) {
            alert(msg, 'success');
        }

        function alert(msg, type) {
            var obj = {
                text: msg + '',
                type: type
            };
            $scope.messages.unshift(obj);
            $timeout(function() {
                $scope.messages.splice($scope.messages.indexOf(obj), 1);
            }, 10000);
        }

    });
