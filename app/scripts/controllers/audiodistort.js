'use strict';

angular.module('clientApp')
  .controller('AudiodistortCtrl', function ($scope, polyfill) {
	  var context = new window.webkitAudioContext();

	  navigator.getUserMedia({audio: true},
	    function(stream) {
	      // var source;
	      // if (window.webkitURL) {
	      //   source = window.webkitURL.createObjectURL(stream);
	      // } else {
	      //   source = stream; // Opera and Firefox
	      // }
	      // console.log(source);
	      var microphone = context.createMediaStreamSource(stream);
	      var filter = context.createBiquadFilter();

	      // microphone -> filter -> destination.
	      microphone.connect(filter);
	      filter.connect(context.destination);
	    }
	  );
  });
