'use strict';

describe('Controller: NewLessonCtrl', function () {

  // load the controller's module
  beforeEach(module('deluciaApp'));

  var NewLessonCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewLessonCtrl = $controller('NewLessonCtrl', {
      $scope: scope,
      user: {}
    });
  }));

  it('should attach a list of languages to the scope', function () {
    expect(scope.languages.length).not.toBe(null);
  });
});
