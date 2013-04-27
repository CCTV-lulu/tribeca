'use strict';

describe('Controller: SaveaudioCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var SaveaudioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SaveaudioCtrl = $controller('SaveaudioCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
