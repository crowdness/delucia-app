'use strict';

describe('Controller: UploadVideoCallbackCtrl', function () {

  // load the controller's module
  beforeEach(module('deluciaApp'));

  var UploadVideoCallbackCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UploadVideoCallbackCtrl = $controller('UploadVideoCallbackCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
