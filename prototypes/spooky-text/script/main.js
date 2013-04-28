(function(){

	var app = {
		_fonts: [
			"Nightbird", "Face Your Fears", "Brain Flower", "Bloody", "Crimes Six", "Frankentype", "Monsterama"
		],

		init: function() {
		    app.spookify($('.make-spooky'));

			app.webfontInit();
		},

		webfontInit: function() {
			window.WebFontConfig = { fontdeck: { id: '32303' } };

			(function() {
			  var wf = document.createElement('script');
			  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
			  '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
			  wf.type = 'text/javascript';
			  wf.async = 'true';
			  var s = document.getElementsByTagName('script')[0];
			  s.parentNode.insertBefore(wf, s);
			})();
		},

	    spookify: function(el) {

	    	var spook = $('<div/>').addClass('spooky-wrap');
	    	var face = app._fonts[Math.floor(Math.random()*app._fonts.length)];
	    	console.log(face);
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
	        	translate: [0, 100]
	        });

	        el.transition({
	        	opacity: 1,
	        	translate: [0, 0],
	        	duration: 2000
	        })

	        var letters = el.children('span');

	        _.each(letters, function(letter, index) {
	        	var jqLtr = $(letter);
	            jqLtr.addClass('spooky-char');
	            if (jqLtr.html() == ' ') jqLtr.html('&nbsp;')
	            else app.jitter(jqLtr);
	        });

	    },

	    jitter:function(jqLtr) {
	    	_.defer(function(){
	    		var ref = jqLtr;
		    	jqLtr.transition({
	                rotate: app.range(-15, 15)+'deg',
	                rotateY: app.range(-45, 45)+'deg',
	                opacity: app.range(.5, 1),
	                translate: [app.range(-2, 2), app.range(-6, 6)],
	                duration: app.range(1000, 2000),
	                easing: 'linear',
	                '-webkit-filter': 'blur(' + app.range(0, 5) + 'px)',
	                delay: 0,
	                complete: function() {app.jitter(ref)}
		   		});
	    	})
	    },

	    spawn:function(text) {
	    	var spawn = $('<div/>').addClass('make-spooky').html(text);
	    	$('.container').append(spawn);
	    	app.spookify(spawn);
	    },


	    range: function(min, max, round) {
	        return (round) ? Math.round(Math.random()*(max-min) + min) : Math.random()*(max-min) + min;
	    }
	};

	app.init();

	window.spawn = app.spawn;
})()