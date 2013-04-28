'use strict';

angular.module('clientApp')
  .controller('ThegameCtrl', function ($scope, $rootScope) {

    var ready = false, timeout = 1000 / 12, progress = 0;

    $rootScope.timeStart = new Date().getTime()/1000;
    $rootScope.timeNow = new Date().getTime()/1000;
    $rootScope.timeToDie = 60;

    console.log('game starting');

    var initialized = false;

    // init audio
    var darksounds = [$('#feeding-loop')[0]];
    var lightsounds = [];

    $.each(darksounds, function(i, v) {
      v.play();
    });

    function initHyperlapse() {

      /* Hyperlapse */

      var is_moving = false;
      var px, py;
      var onPointerDownPointerX = 0, onPointerDownPointerY = 0;
      var offset = { x: 0, y: 0 };

      ready = true;
      $rootScope.hyperlapse.next();
      $rootScope.hyperlapse.prev();
      $rootScope.timeStart = new Date().getTime()/1000;

      $rootScope.pano.style.display = 'block';
      $rootScope.pano.addEventListener('mousemove', function(e){
      
        if (!ready) {
          return;
        }

        var f = $rootScope.hyperlapse.fov() / 500;
        var dx = (e.webkitMovementX) * f;
        var dy = (e.webkitMovementY) * f;

        var px = (e.clientX / window.innerWidth) - 0.5;
        var py = (e.clientY / window.innerHeight) - 0.5;
        $rootScope.hyperlapse.position.x = px * 360;
        $rootScope.hyperlapse.position.y = - py * 90;
      
      });

      var cancelTimer = true;

      $rootScope.pano.addEventListener('mousedown', function(e) {

        if (!ready) {
          return;
        }

        var abs = Math.abs($rootScope.hyperlapse.position.x);
        var isForward = abs < 45;
        var isBackward = abs > 90;

        if (isForward || isBackward) {
          cancelTimer = false;
          run(isForward);
        }

      });

      $rootScope.pano.addEventListener('mouseup', function(e) {

        cancelTimer = true;

      });

      function run(forward) {

        if (!ready) {
          return;
        }

        if (forward) {
          $rootScope.hyperlapse.next();
        } else {
          $rootScope.hyperlapse.prev();
        }

        if (!cancelTimer) {
          _.delay(run, timeout, forward);
        }

      }

      var bobHeight = 20;
      var inc = 0;

      function loop() {

        if (cancelTimer && $rootScope.hyperlapse.camera) {
          // Bob the camera like panting
          var cy = $rootScope.hyperlapse.camera.position.y;
          $rootScope.hyperlapse.camera.position.y = Math.sin(inc) * bobHeight;
          // $rootScope.hyperlapse.camera.position.z = Math.sin(inc) * bobHeight / 2;
          inc += 0.04;
        }

        requestAnimationFrame(loop);

      }

      loop();

      window.addEventListener('resize', function(){
        $rootScope.hyperlapse.setSize(window.innerWidth, window.innerHeight);
      }, false);

      document.addEventListener( 'keydown', onKeyDown, false );
      function onKeyDown ( event ) {

        switch( event.keyCode ) {
          case 190: /* > */
            $rootScope.hyperlapse.next();
            break;

          case 188: /* < */
            $rootScope.hyperlapse.prev();
            break;
        }

      };

    }

    var start = function() {
      setTimeout(
        function(){
          if (!$rootScope.PANOREADY) {
            start();
          } else {
            initHyperlapse();
          };
        }, 1000
      )
    };

    start();


  });
