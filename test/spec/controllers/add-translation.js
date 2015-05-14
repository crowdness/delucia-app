'use strict';

describe('Controller: AddTranslationCtrl', function () {

  // load the controller's module
  beforeEach(module('deluciaApp'));

  var AddTranslationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddTranslationCtrl = $controller('AddTranslationCtrl', {
      $scope: scope,
      $routeParams: {lessonId: '1'},
      user: {}
    });
  }));

  // it('should attach a list of languages to the scope', function () {
  //   expect(scope.languages.length).toBe(3);
  // });
});
