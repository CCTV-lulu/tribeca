'use strict';

angular.module('clientApp')
  .factory('animatedParticles', function ($rootScope) {

    var spritesheets = [
      // { path: './images/bear-leg.png', offset: 1 / 3, limit: 3 }
      { path: './images/bats.png', offset: 1 / 14, limit: 14 }
    ];

    var amount = 100, sprites, materials, scene;
    var frameCount = 0;

    return {

      init: function () {

        /**
         * Add to THREE.Scene
         */

        scene = $rootScope.hyperlapse.scene;
        
        materials = _.map(spritesheets, function(s) {
          var map = THREE.ImageUtils.loadTexture(s.path);
          var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xffffff,
            useScreenCoordinates: false
          });
          material.imageOptions = { offset: s.offset, limit: s.limit };
          return material;
        });

        sprites = _.map(_.range(amount), function(i) {
          var material = materials[Math.floor(Math.random() * materials.length)];
          var imageOptions = material.imageOptions;
          material = material.clone();
          // material.opacity = Math.random();
          material.uvScale.set(1, imageOptions.offset);
          material.uvOffset.set(0, imageOptions.offset * Math.floor(Math.random() * imageOptions.limit));
          var sprite = new THREE.Sprite(material);
          sprite.imageOptions = imageOptions;
          scene.add(sprite);
          sprite.position.set(- Math.random() * 1000, Math.random() * 1000 - 500, Math.random() * 1000 - 500);
          // var size = Math.sqrt(Math.random()) * 100;
          var size = 20;
          sprite.rotation.y = Math.random() * Math.PI;
          sprite.scale.set(size, size, 1);
          sprite.velocity = 10 * Math.random() + 10;
          return sprite;
        });

        return this;

      },

      update: function() {

        frameCount++;

        _.each(sprites, function(s) {
          var p = s.position.x;
          if (p > 1000 || p < -1000) {
            s.position.x = -1000;
          }
          s.position.x += s.velocity;
          s.opacity = Math.min(p / 500, 1);
        });

        if ((frameCount % (60 / 30))) {
          return;
        }

        _.each(sprites, function(s) {
          var io = s.imageOptions;
          s.material.uvOffset.y = (s.material.uvOffset.y + io.offset) % 1;
        });

        return this;

      }

    };

});
