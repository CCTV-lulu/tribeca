'use strict';

describe('Service: hyperlapse', function () {

  // load the service's module
  beforeEach(module('tribecaApp'));

  // instantiate service
  var hyperlapse;
  beforeEach(inject(function(_hyperlapse_) {
    hyperlapse = _hyperlapse_;
  }));

  it('should do something', function () {
    expect(!!hyperlapse).toBe(true);
  });

});
