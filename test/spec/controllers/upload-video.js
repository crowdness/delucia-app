'use strict';

describe('Controller: UploadVideoCtrl', function () {

  // load the controller's module
  beforeEach(module('deluciaApp'));

  var UploadVideoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UploadVideoCtrl = $controller('UploadVideoCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
