'use strict';

angular.module('clientApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/3daudio', {
        templateUrl: 'views/3daudio.html',
        controller: '3daudioCtrl'
      })
      .when('/saveaudio', {
        templateUrl: 'views/saveaudio.html',
        controller: 'SaveaudioCtrl'
      })
      .when('/audiodistort', {
        templateUrl: 'views/audiodistort.html',
        controller: 'AudiodistortCtrl'
      })
      .when('/lupus', {
        templateUrl: 'views/lupus.html',
        controller: 'LupusCtrl'
      })
      .when('/happywolfyfuntimeandrainbow', {
        templateUrl: 'views/happywolfyfuntimeandrainbow.html',
        controller: 'HappywolfyfuntimeandrainbowCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
