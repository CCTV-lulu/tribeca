/**
 * Gets the microphone!
 */
var POSITION;

(function() { 
  var init = function() {
    navigator.geolocation.getCurrentPosition( function(position){
      POSITION = position;
    }, alert );
  };
  init();

})();