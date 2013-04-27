var app = {

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

	    	el.addClass('spooky-text').removeClass('make-spooky');

	        el.lettering();

	        el.transition({
	        	rotateY: app.range(-20,20,true)+'deg',
	        	scale: [0.6, 1]
	        });

	        var letters = el.children('span');

	        _.each(letters, function(letter, index) {
	        	var jqLtr = $(letter);
	            jqLtr.addClass('spooky-char');
	            if (jqLtr.html() == ' ') jqLtr.html('&nbsp;&nbsp;')
	            else app.jitter(jqLtr);
	        });

	        el.replaceWith(spook);
	        spook.append(el);
	    },

	    jitter: function(jqLtr) {
	    	//console.log(jqLtr);
	    	jqLtr.transition({
                rotate: app.range(-15, 15)+'deg',
                rotateY: app.range(-30, 30)+'deg',
                translate: [app.range(-2, 2), app.range(-6, 6)]
	   		}, 2000);
	    },


	    range: function(min, max, round) {
	        return (round) ? Math.round(Math.random()*(max-min) + min) : Math.random()*(max-min) + min;
	    }