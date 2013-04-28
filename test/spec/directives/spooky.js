'use strict';

describe('Directive: spooky', function () {
  beforeEach(module('clientApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<spooky></spooky>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the spooky directive');
  }));
});
