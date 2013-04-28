'use strict';

describe('Service: animatedParticles', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var animatedParticles;
  beforeEach(inject(function (_animatedParticles_) {
    animatedParticles = _animatedParticles_;
  }));

  it('should do something', function () {
    expect(!!animatedParticles).toBe(true);
  });

});
