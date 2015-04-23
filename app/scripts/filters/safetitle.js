'use strict';

/**
 * @ngdoc filter
 * @name deluciaApp.filter:safeTitle
 * @function
 * @description
 * # safeTitle
 * Filter in the deluciaApp.
 */
angular.module('deluciaApp')
  .filter('safeTitle', function () {
    return function (input) {
      return input.replace(/\W+/g, '-').replace(/^-|-$/g, '').toLowerCase();
    };
  });

