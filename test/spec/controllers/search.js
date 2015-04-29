'use strict';

describe('Controller: SearchCtrl', function() {

    // load the controller's module
    beforeEach(module('deluciaApp'));

    var SearchCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        SearchCtrl = $controller('SearchCtrl', {
            $scope: scope,
            $routeParams: {
                q: 'test',
                lang: 'en'
            }
        });
    }));

    it('should attach q to the scope', function() {
        expect(scope.q).not.toBe(undefined);
    });
});
