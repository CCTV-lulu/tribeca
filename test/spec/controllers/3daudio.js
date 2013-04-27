'use strict';

describe('Controller: 3daudioCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var 3daudioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    3daudioCtrl = $controller('3daudioCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
