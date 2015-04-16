'use strict';

/**
 * @ngdoc filter
 * @name deluciaApp.filter:camel
 * @function
 * @description
 * # camel
 * Filter in the deluciaApp.
 */
angular.module('deluciaApp')
    .filter('camel', function() {
        return function(input) {
            //inspired by: http://kevin.vanzonneveld.net
            input += '';
            var f = input.charAt(0).toUpperCase();
            return f + input.substr(1);
        };
    });
