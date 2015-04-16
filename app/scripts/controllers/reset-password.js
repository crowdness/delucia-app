'use strict';
/**
 * @ngdoc function
 * @name deluciaApp.controller:ResetPasswordCtrl
 * @description
 * # ResetPasswordCtrl
 * Sends password reset request.
 */
angular.module('deluciaApp')
    .controller('ResetPasswordCtrl', function($scope, Auth) {
        $scope.reset = function(email) {
            $scope.frm.submitted = true;
            delete $scope.err;

            if ($scope.frm.$valid) {
                $scope.frm.submitted = false;

                Auth.$resetPassword({
                    email: email
                }).then(function() {
                    $scope.frm.result = 'Password reset email sent successfully!';
                }).catch(function(error) {
                    $scope.err = error;
                });
            }
        };
    });
