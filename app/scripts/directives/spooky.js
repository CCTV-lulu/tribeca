'use strict';

angular.module('clientApp')
  .directive('spooky', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the spooky directive');
      }
    };
  });
