'use strict';

angular.module('clientApp')
  .controller('ThegameCtrl', function ($scope, $rootScope, animatedParticles) {

    function BufferLoader(context,urlList,callback){this.context=context;this.urlList=urlList;this.onload=callback;this.bufferList=new Array();this.loadCount=0;}
BufferLoader.prototype.loadBuffer=function(url,index){var request=new XMLHttpRequest();request.open("GET",url,true);request.responseType="arraybuffer";var loader=this;request.onload=function(){loader.context.decodeAudioData(request.response,function(buffer){if(!buffer){alert('error decoding file data: '+url);return;}
loader.bufferList[index]=buffer;if(++loader.loadCount==loader.urlList.length)
loader.onload(loader.bufferList);},function(error){console.error('decodeAudioData error',error);});}
request.onerror=function(){alert('BufferLoader: XHR error');}
request.send();}
BufferLoader.prototype.load=function(){for(var i=0;i<this.urlList.length;++i)
this.loadBuffer(this.urlList[i],i);}

    var ready = false, timeout = 1000 / 12, progress = 0;

    $rootScope.timeStart = new Date().getTime()/1000;
    $rootScope.timeNow = new Date().getTime()/1000;
    $rootScope.CINEMATIC = false;

    console.log('game starting');

    var initialized = false;

    // init audio
    var ctx = new webkitAudioContext();
    var darkgain = ctx.createGainNode();
    var darksounds = new BufferLoader(ctx, [
      'audio/gore/160975__vosvoy__ragingzombie-feeding-loop.mp3',
      // 'audio/gore/132106__sironboy__woman-scream.mp3',
      'audio/gore/35494__co3__horror-ambient-clean.mp3',
      'audio/gore/49128__aesqe__monster-growl-02.mp3',
      'audio/gore/104039__rutgermuller__scream-owowo-1.mp3',
      'audio/gore/169813__missozzy__curse-02.mp3'
      ], function(list) {
        $.each(list, function(i, b) {
          var s = ctx.createBufferSource();
          s.buffer = b;
          s.loop = true;
          s.connect(darkgain);
          s.noteOn(0);
        });
        darkgain.gain.value = 0.3;
        darkgain.connect(ctx.destination);
      });
    darksounds.load();



      function playSounds(ids, callback)  {
        if (ids.length == 0) {
          callback();
          return;
        }
        var storyCurrentId = ids.shift();
         var $story = $('#story-'+storyCurrentId)
         var story = $story[0];
          console.log('story', story)
          story.play();
          $story.on("ended", function(){
            console.log('end');
            playSounds(ids, callback);
          });
      }



       var audioMap = {
      'start': {
        '0': {
          sounds: [1,2,3]
        },
      },
      'light': {
        '0.25': {
          sounds: [4,7,8]
        },
        '0.5': {
          sounds: [5,6]
        },
        '0.75': {
          sounds: [11,12,13]
        },
        '1': {
          sounds: [14,15]
        }
      },
      'dark': {
        '0.25': {
          sounds: [16,17]
        },
        '0.5': {
          sounds: [18,19]
        },
        '0.75': {
          sounds: [20,21]
        },
        '1': {
          sounds: [22,23]
        }
      },
    };


      $rootScope.CINEMATIC = true;
      var ids = audioMap.start['0'].sounds;
      playSounds(ids, function() {
        $rootScope.CINEMATIC = false;
      });

    function initHyperlapse() {

      /* Hyperlapse */

      animatedParticles.init();

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

        var gain = Math.abs($rootScope.hyperlapse.position.x / 180.0);
        darkgain.gain.value = gain;
      
      });

      var cancelTimer = true;

      $rootScope.pano.addEventListener('mousedown', function(e) {

        if (!ready) {
          return;
        }

        if ($rootScope.CINEMATIC) {
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


        if ($rootScope.CINEMATIC == false) {
          var l = $rootScope.progress;
          var d = $rootScope.darkness;
          if (lightorder.length > 0 && l >= lightorder[0]) {
              var ll = lightorder.shift();
              $rootScope.CINEMATIC = true;
              console.log(ll, lightorder, l);
              playSounds(audioMap.light[ll.toString()].sounds, function() {
                $rootScope.CINEMATIC = false;
              });
          } else if (darkorder.length > 0 && d >= darkorder[0]) {
            var ll = darkorder.shift();
              $rootScope.CINEMATIC = true;
              playSounds(audioMap.dark[ll.toString()].sounds, function() {
                $rootScope.CINEMATIC = false;
              });
          }
        }

        if ($rootScope.CINEMATIC) {
          darkgain.gain.value = 0.3;
        }


        requestAnimationFrame(loop);
      }

      loop();

      window.addEventListener('resize', function(){
        $rootScope.hyperlapse.setSize(window.innerWidth, window.innerHeight);
      }, false);

      document.addEventListener( 'keydown', onKeyDown, false );
      function onKeyDown ( event ) {
        var key = event.keyCode;
        // console.log(key)
        if ($rootScope.CINEMATIC) {
          return;
        }  
        if (key == 190 || key == 38 || key == 39 || key == 87 || key == 68 || key == 32) /* > */
          $rootScope.hyperlapse.next();
        if (key == 188 || key == 37 || key == 40 || key == 83 || key == 65 || key == 8) /* < */
          $rootScope.hyperlapse.prev();
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
        }, 200
      )

    };

    var storyCurrentId = 1;
    var played = [];

    var lightorder = [.25, .5, .75, 1];
    var darkorder = [.25, .5, .75, 1];

   
    

    start();


  });
