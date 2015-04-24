'use strict';

describe('Controller: AmendLessonCtrl', function () {

  // load the controller's module
  beforeEach(module('deluciaApp'));

  var AmendLessonCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AmendLessonCtrl = $controller('AmendLessonCtrl', {
      $scope: scope,
      $routeParams: {lessonId: '1'}
    });
  }));

  it('should attach a list of languages to the scope', function () {
    expect(scope.languages.length).toBe(2);
  });
});
