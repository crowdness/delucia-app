'use strict';

describe('Filter: camel', function () {

  // load the filter's module
  beforeEach(module('deluciaApp'));

  // initialize a new instance of the filter before each test
  var camel;
  beforeEach(inject(function ($filter) {
    camel = $filter('camel');
  }));

  it('should return the input capital first letter', function () {
    var text = 'angularjs';
    expect(camel(text)).toBe('Angularjs');
  });

});
