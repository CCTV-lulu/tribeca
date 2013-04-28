'use strict';

angular.module('clientApp')
  .factory('hyperlapse', function($rootScope) {
  
  var init = function() {
    // $rootScope.position = POSITION;
    getDestination();
  };

  var getDestination = function() {
    console.log('looking for destination');
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
        console.log("end_point set");
        createHyperlapse();
      } else {
        alert("can't find route");
      }
    }

  var createHyperlapse = function() {

    console.log('creating hyperlapse');

    var lutTexture = THREE.ImageUtils.loadTexture( "images/LUT1.png" );
    lutTexture.magFilter = THREE.NearestFilter;
    lutTexture.minFilter = THREE.NearestFilter;
    lutTexture.m
    var uniforms = {
        map: { type: "t", value: null },
        LUT: { type: "t", value: lutTexture },
        progress: { type: "f", value: null},
        lightness: { type: "f", value: 0},
        darkness: { type: "f", value: 0},
        time: { type: "f", value: 0}
    };

    $rootScope.material = new THREE.ShaderMaterial( {

        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent

      } );

    $rootScope.pano = document.getElementById('pano');
    $rootScope.pano.style.display = 'none';

    $rootScope.hyperlapse = new Hyperlapse($rootScope.pano, {
      lookat: $rootScope.end_point,
      fov: 100,
      millis: 50,
      width: window.innerWidth,
      height: window.innerHeight,
      zoom: 2,
      use_lookat: false,
      distance_between_points: 2,
      max_points: 100,
      material: $rootScope.material
    });

    $rootScope.hyperlapse.onRouteComplete = function(e) {
      $rootScope.hyperlapse.load();
    };

    $rootScope.hyperlapse.onLoadComplete = function(e) {
      
      console.log('paneready');
      $rootScope.PANOREADY = true;
      $('#pano').fadeIn(10000, function(){
        console.log('fade complete');
      });

    };

    $rootScope.hyperlapse.onError = function(e) {
      console.log( "ERROR: "+ e.message );
    };

    $rootScope.hyperlapse.onFrame = function(e) {
      $rootScope.progress = (e.position+1)/$rootScope.hyperlapse.length();
      $rootScope.material.uniforms.progress.value = $rootScope.progress;
      $rootScope.material.uniforms.lightness.value = $rootScope.progress/2;
    };

    $rootScope.timeStart = new Date().getTime()/1000;
    $rootScope.timeNow = new Date().getTime()/1000;
    $rootScope.timeToDie = 60;

    $rootScope.hyperlapse.onAnimate = function() {
      $rootScope.timeNow = new Date().getTime()/1000;
      $rootScope.material.uniforms.time.value = $rootScope.timeNow - $rootScope.timeStart;
      $rootScope.dark = ($rootScope.timeNow - $rootScope.timeStart)/$rootScope.timeToDie;
      $rootScope.material.uniforms.darkness.value = $rootScope.dark * 2;
      if ($rootScope.dark === 1) {
        DIE();
      }
    };

    var DIE = _.once(function() {
      $rootScope.$broadcast('dead');
    });

    var directions_service = new google.maps.DirectionsService();

    var generate = function(){
      var request = {
        origin: $rootScope.start_point, 
        destination: $rootScope.end_point, 
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };

      directions_service.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {   
          $rootScope.hyperlapse.generate({route: response});
        } else {
          console.log(status);
        }
      })
    };

    generate();

  }

  return {
    init: init,
    getDestination: getDestination,
    getRoute: getRoute
  };
});
