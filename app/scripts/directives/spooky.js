'use strict';

angular.module('clientApp')
  .directive('spooky', function () {

    var app = {

  		_fonts: [
  			"Nightbird", "Face Your Fears", "Bloody", "Crimes Six", "Frankentype", "Monsterama"
  		],

  		init: function() {
  		},

  	    spookify: function(el) {

  	    	var spook = $('<div/>').addClass('spooky-wrap');
  	    	var face = app._fonts[Math.floor(Math.random()*app._fonts.length)];
  	    	
  	    	el
  	    		.addClass('spooky-text')
  	    		.removeClass('make-spooky')
  	    		.css("font-family", face);

  	        el.lettering();

  	        el.replaceWith(spook);
  	        spook.append(el);

  	        el.transition({
  	        	rotateY: app.range(-20,20,true)+'deg',
  	        	scale: [0.6, 1],
              opacity: 1
  	        });
            
  	        var letters = el.children('span');

  	        _.each(letters, function(letter, index) {
  	        	var jqLtr = $(letter);
  	            jqLtr.addClass('spooky-char');
  	            if (jqLtr.html() == ' ') jqLtr.html('&nbsp;')
  	            else app.jitter(jqLtr, index, true);
  	        });

          spook.bind('mouseover', function(){
              $(this).children('.spooky-text').children('span').each(function(){ $(this).addClass('no-animate');});
          }).bind('mouseout', function(){
              $(this).children('.spooky-text').children('span').each(function(){ $(this).removeClass('no-animate');});
          });

  	    },

  	    jitter:function(jqLtr, index, first) {
            var delay = (first) ? (index*100) + 1000 : 0;
  	    	_.defer(function(){
  	    		var ref = jqLtr;
            if (jqLtr.hasClass('no-animate')) {
              jqLtr.transition({
                      rotate: '0deg',
                      rotateY: '0deg',
                      opacity: 1,
                      translate: [0,0],
                      duration: 150,
                      easing: 'linear',
                      '-webkit-filter': 'blur(0px)',
                      delay: 0,
                      complete: function() { app.jitter(ref, 0, false)}
              });

            } else {
    		    	jqLtr.transition({
    	                rotate: app.range(-15, 15)+'deg',
    	                rotateY: app.range(-45, 45)+'deg',
    	                opacity: app.range(.5, 1),
    	                translate: [app.range(-2, 2), app.range(-6, 6)],
    	                duration: app.range(1000, 2000),
    	                easing: 'linear',
    	                '-webkit-filter': 'blur(' + app.range(0, 5) + 'px)',
    	                delay: delay,
    	                complete: function() { app.jitter(ref, 0, false)}
    		   		});
            }
  	    	})
  	    },

  	    spawn:function(text, selector) {
  	    	var spawn = $('<div/>').addClass('make-spooky').html(text);
  	    	var $el = $(selector || '.container');

  	    	$el.children().hide();
  	    	_.defer(function() {
  	    	  $el.append(spawn);
    	    	app.spookify(spawn);
  	    	});
  	    },


  	    range: function(min, max, round) {
  	        return (round) ? Math.round(Math.random()*(max-min) + min) : Math.random()*(max-min) + min;
  	    }
  	};

    app.init();

    return {
      template: '<div ng-transclude></div>',
      restrict: 'E',
      transclude: true,
      link: function postLink(scope, element, attrs) {
        app.spawn(element.html(), element);
      }
    };
  });
