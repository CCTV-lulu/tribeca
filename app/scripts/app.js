'use strict';

angular.module('clientApp', [])
  .config(function ($routeProvider) {
    var animatein = {
      resolve: ['$q', '$timeout', function($q, $timeout) {
        var d = $q.defer();
        $timeout(function() {
          d.resolve();
          $('.container').css('opacity', 1);
        }, 500);
        return d.promise;
      }]
    };
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
        controller: 'HappywolfyfuntimeandrainbowCtrl',
        resolve: animatein
      })
      .when('/thegame', {
        templateUrl: 'views/thegame.html',
        controller: 'ThegameCtrl',
        resolve: animatein
      })
      .when('/death', {
        templateUrl: 'views/death.html',
        controller: 'DeathCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function($rootScope, hyperlapse) {
    $rootScope.$on('$routeChangeStart', function() {
      $('.container').css('opacity', 0);
    });
    navigator.geolocation.getCurrentPosition( function(position){
      $rootScope.position = position;
      console.log($rootScope.position);
      hyperlapse.init();
    }, alert );
  });
