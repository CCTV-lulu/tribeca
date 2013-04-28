'use strict';

angular.module('clientApp')
  .controller('HappywolfyfuntimeandrainbowCtrl', function ($scope, $location) {

        var moon, wolf, star;
        var BONUS = 1000;

        $(function() {

          var _init = _.after(3, init);

          moon = document.createElement('img');
          $(moon).bind('load', _init);
          moon.src = './images/moon.png';

          star = document.createElement('img');
          $(star).bind('load', _init);
          star.src = './images/star.png';

          wolf = document.createElement('img');
          $(wolf).bind('load', _init);
          wolf.src = './images/wolf.png';

        });

        var physics;
        var offered = false;

        function init() {

          var M = new MersenneTwister();

          var game = {
            started: false,
            ended: false,
            highscore: 0
          };
          var score = $('#score');
          var multiplier = 1.0;
          $('#stats button').click(reset);
          var _endGame = _.once(endGame);

          var two = new Two({
            width: 800,
            height: 500,
            type: Two.Types.canvas
          }).appendTo($('#content .wrapper')[0]);
          var gravity = 0.75;
          physics = new Physics(gravity);

          two.$domElement = $(two.renderer.domElement);

          var groundDepth = 50;
          var ground = two.makeRectangle(two.width / 2, two.height - 5, two.width, groundDepth);
          ground.depth = groundDepth;
          ground.noStroke();
          ground.fill = '#5faf7c';

          var heroHeight = 60;
          var hero = two.makeRectangle(two.width / 2, two.height, heroHeight, heroHeight);
          hero.particle = physics.makeParticle(1.0, two.width / 2, two.height / 2);
          hero.particle.position = hero.translation;
          hero.noStroke().fill = 'black';
          hero.destination = new Two.Vector();

          var dDiff = 74;
          var nDiff = 30;
          var frame = 1;
          var frameCount = 12;

          hero.image = wolf;
          hero.width = 0;
          hero.height = 0;

          hero.dwidth = 100;
          hero.dheight = 60;

          hero.nx = 50;
          hero.ny = 0;

          hero.nwidth = 100;
          hero.nheight = 60;

          hero.jump = function() {
            this.particle.velocity.y = - 20;
            if (game.started) {
              updateScore();
            }
            return this;
          };

          ground.constraint = ground.translation.y - (ground.depth + heroHeight) / 2;

          var amount = 50;
          var summit = 0;
          var verticalIncrement = 150;
          var jumps = _.map(_.range(amount), function(i) {
            return addJump(getHorizontal(), getVertical());
          });

          var $window = $(window)
            .bind('mousemove', function(e) {
              var offset = two.$domElement.offset();
              hero.destination.set(e.clientX - offset.left, e.clientY - offset.top);
            })
            .bind('mouseup', function(e) {
              if (game.ended) {
                return;
              }
              var particle = hero.particle;
              var position = particle.position;
              if (position.y >= ground.constraint) {
                hero.jump();
              }
            });

          physics
            .onUpdate(function() {

              TWEEN.update();

              summit++;

              var particle = hero.particle;
              var position = particle.position;

              var delta = hero.destination.x - position.x;
              var isLeft;

              if (delta < 0) {
                isLeft = false;
              } else if (delta > 0) {
                isLeft = true;
              }

              var step = 12;

              position.y = Math.min(ground.constraint, position.y);
              // if (Math.abs(delta) <= step) {
              //   position.x = hero.destination.x;
              // } else if (delta < step) {
              //   position.x -= 7;
              // } else if (delta > step) {
              //   position.x += step;
              // }
              position.x += (hero.destination.x - position.x) * 0.125;

              if (Math.abs(delta) > 0.1) {
                run(isLeft);
              } else {
                stand();
              }

              _.each(jumps, function(jump, i) {
                var dead = jump.update();
                if (dead) {
                  jump.opacity -= jump.opacity * 0.125;
                  if (jump.opacity < 0.01) {
                    circleOfLife(i);
                    _.defer(function() {
                      jump.opacity = 1.0;
                    });
                  }
                } else if (jump.within(position)) {
                  game.started = true;
                  hero.jump();
                  jump.explode();
                  circleOfLife(i); 
                }
              });

              focusHeight(position.y);
              calculateMultiplier();

              two.update();

            })
            .play();

          _.defer(function() {
            $('#content').fadeIn();
          });

          function stand() {
            frame = 0;
            updateFrame();
          }

          function run(isLeft) {
            // Flip the stance
            if (!_.isUndefined(isLeft)) {
              hero.reflectY = !isLeft;
            }
            frame = (frame + 0.5) % frameCount;
            updateFrame();
          }

          function updateFrame() {
            hero.height = - dDiff * Math.floor(frame);
            hero.ny = nDiff;
          }

          function getHorizontal() {
            return two.width / 2 - (M.random() * two.width * 0.66 - two.width * 0.33);
          }

          function getVertical() {
            summit -= verticalIncrement * M.random() + verticalIncrement / 4;
            return summit;
          }

          function circleOfLife(i) {
            var x = getHorizontal();
            var y = getVertical();
            jumps[i].visible = false;
            jumps[i].translation.set(x, y);
            _.defer(function() {
              jumps[i].visible = true;
            });
          }

          function addJump(x, y, r) {

            var color = 'white';
            var radius = r || 50;
            var diameter = radius * 2;
            var offset = diameter * 1.5;
            var callback = _.identity;

            var circle = two.makeCircle(x, y, radius);
            circle.noStroke().fill = color;
            circle.image = moon;
            circle.width = 50;
            circle.height = 50;

            var amount = 8;
            var particles = _.map(_.range(amount), function(i) {
              var particle = two.makeCircle(0, 0, radius / (amount / 2));
              particle.visible = false;
              particle.noStroke().fill = color;
              particle.origin = new Two.Vector(x, y);
              particle.image = star;
              particle.width = 12;
              particle.height = 12;
              return particle;
            });

            var k = 0.0125;
            var tween = new TWEEN.Tween()
              .to({}, 350)
              .easing(TWEEN.Easing.Circular.Out)
              .onStart(function() {
                _.each(particles, function(p) {
                  p.visible = true;
                  p.origin.copy(hero.translation);
                });
              })
              .onUpdate(function(t) {
                var amplitude = t * offset;
                _.each(particles, function(p, i) {
                  var pct = (i + 1) / amount;
                  var theta = Math.PI * 2 * pct;
                  var x = amplitude * Math.cos(theta) + p.origin.x;
                  var y = amplitude * Math.sin(theta) + p.origin.y;
                  p.translation.set(x, y);
                  p.opacity = 1 - (k * t) / (k - t + 1);
                  p.rotation = theta + Math.PI / 2;
                });
              })
              .onComplete(function() {
                _.each(particles, function(p) {
                  p.visible = false;
                  p.opacity = 0.0;
                  _.defer(function() {
                    p.translation.clear();
                  });
                });
                callback();
              })

            circle.update = function() {
              circle.translation.y += 1;
              if (circle.translation.y >= ground.constraint - offset) {
                return true;
              }
              return false;
            };
            circle.within = function(v) {
              var delta = circle.translation.distanceTo(v);
              if (delta < radius) {
                return true;
              }
              return false;
            };
            circle.explode = function(c) {
              if (_.isFunction(c)) {
                callback = c;
              }
              tween.start();
            };

            return circle;

          }

          function focusHeight(posY) {

            var destination = posY - two.height / 2;
            var ty = two.scene.translation.y;
            if (game.ended || Math.abs(Math.abs(ty) - Math.abs(destination)) > two.height / 4) {
              var dest = Math.max(-destination, 0);
              two.scene.translation.y += (dest - ty) * 0.0625;
            }

          }

          function calculateMultiplier() {
            multiplier += 1 / 60;
            if (hero.translation.y >= ground.constraint) {
              multiplier = 1.0;
              if (game.started) {
                _endGame();
              }
            }
          }

          function reset() {
            game.started = false;
            game.ended = false;
            score.html(0);
            $('#stats').fadeOut();
            _endGame = _.once(endGame);
            summit = 0;
            _.each(jumps, function(j, i) {
              if (j.translation.y < 0) {
                circleOfLife(i);
              }
            });
          }

          function updateScore() {
          	var points = Math.round(parseInt(score.html()) + 10 * multiplier);
            score.html(points);
            if (!offered && points > BONUS) {
            	theoffer();
            	offered = true;
            }
          }

          function endGame() {
            game.highscore = Math.max(game.highscore, parseInt(score.html()));
            var $stats = $('#stats');
            $stats.find('.highscore').html(game.highscore);
            $stats.find('.score').html(score.html());
            $stats.fadeIn();
            game.ended = true;
          }

        }

        function mod(v, limit) {
          while (v < 0) {
            v += limit;
          }
          return v % limit;
        }

        function theoffer() {
        	physics.pause();
        	$scope.offer = true;
        	$scope.$apply();
        	$('#content').css('-webkit-filter', 'blur(10px)');
        	spooky
        }

        // $scope.offer = true;
        // $scope.$apply();

        $scope.agree = function() {
        	$scope.offer = false;
        	$location.path("thegame");
        }

        $scope.disagree = function() {
        	physics.play();
        	$scope.offer = false;
        	$('#content').css('-webkit-filter', 'none');
        }
    });
