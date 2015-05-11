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
});
