'use strict';

angular.module('clientApp')
  .controller('SaveaudioCtrl', function ($scope, polyfill, Recorder) {

  // ajax for all current audio files

  var rec;

  function record() {
    var context = new window.webkitAudioContext();
    navigator.getUserMedia({audio: true},
      function(stream) {
        var microphone = context.createMediaStreamSource(stream);
        rec = new Recorder(microphone);
        rec.record();
        window.rec = rec;
        window.Recorder = Recorder;
      }
    );
  }

  function upload(blob) {
    var data = new FormData();
    data.append('blob', blob, new Date().toString());
    console.log('data', data);
    window.data = data;
    $.get('/api/files/create', function(d) {
      console.log('response', d);
      $.ajax({
        type: 'POST',
        url: d.upload_url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function(items) {
          console.log(items);
          var d = items[0];
          console.log(d);
          setTimeout(function() {
            list();
          }, 500);
        }
      });
    });
  }

  function list() {
    $.get('/api/files/', function(items) {
      $scope.items = items;
      $scope.$apply();
    });
  }

  list();

  $scope.state = 'record';
  $scope.record = function() {
        console.log($scope.state);
    switch ($scope.state) {
      case 'record':
        $scope.state = 'stop';
        record();
        break;
      case 'stop':
        $scope.state = 'record';
        rec.stop();
        rec.exportWAV(function(blob) {
          console.log('Uploading recording.', blob);
          upload(blob);
        });
        break;
    }
    // record
  };




});
