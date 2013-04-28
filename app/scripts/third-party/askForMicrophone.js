/**
 * Gets the microphone!
 */
(function() {
  var getBar = function() {
    microphone.unbind('start', getBar);//.stop();
  }
  microphone.bind('start', getBar).start();
})();