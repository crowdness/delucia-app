'use strict';

describe('Controller: LessonDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('deluciaApp'));

  var LessonDetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LessonDetailCtrl = $controller('LessonDetailCtrl', {
      $scope: scope,
      $routeParams: {lessonId: '1'}
    });
  }));

  it('should attach a lessonId to the scope', function () {
    expect(scope.lessonId).not.toBe(undefined);
  });
});
