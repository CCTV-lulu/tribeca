'use strict';

angular.module('clientApp')
  .factory('hyperlapse', function($rootScope) {
  
  var init = function() {
    navigator.geolocation.getCurrentPosition( function(position){
      $rootScope.position = position;
      console.log($rootScope.position);
      getDestination();
    }, alert );
  };

  var getDestination = function() {
    $rootScope.start_point = new google.maps.LatLng( $rootScope.position.coords.latitude, $rootScope.position.coords.longitude );
    $rootScope.map = new google.maps.Map(document.createElement("div"), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: $rootScope.start_point,
      zoom: 13
    });

    var searchRequest = {
      location: $rootScope.start_point,
      //radius: 10000,
      types: ['funeral_home', 'cemetery'],
      rankBy: google.maps.places.RankBy.DISTANCE
    };
    var service = new google.maps.places.PlacesService($rootScope.map);
    service.nearbySearch(searchRequest, getRoute);
    // service.textSearch(searchRequest, getRoute);
  };

  var getRoute = function( results, status ) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        $rootScope.end_point = results[0].geometry.location;
        //initHyperlapse();
      } else {
        alert("can't find route");
      }
    }

  return {
    init: init,
    getDestination: getDestination,
    getRoute: getRoute
  };
});
