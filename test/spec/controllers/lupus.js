'use strict';

describe('Controller: LupusCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var LupusCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LupusCtrl = $controller('LupusCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
