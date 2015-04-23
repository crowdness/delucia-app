'use strict';

describe('Filter: safeTitle', function () {

  // load the filter's module
  beforeEach(module('deluciaApp'));

  // initialize a new instance of the filter before each test
  var safeTitle;
  beforeEach(inject(function ($filter) {
    safeTitle = $filter('safeTitle');
  }));

  it('should return the input prefixed with "safeTitle filter:"', function () {
    var text = 'Angular js';
    expect(safeTitle(text)).toBe('angular-js');
  });

});
