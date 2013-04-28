'use strict';

describe('Controller: DeathCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DeathCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeathCtrl = $controller('DeathCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
