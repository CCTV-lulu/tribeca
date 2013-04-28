/**
 * microphone.js
 * @jonobr1 / http://jonobr1.com
 *
 * Instructions:
 * 1. add microphone.js script.
 * 2. call `microphone.start();`.
 * 3. call `microphone.update();` when you need to access bandwidth data.
 * 4. use microphone.bands to inspect audible bandwidth values.
 */

(function() {

  var root = this;
  var previousMicrophone = root.microphone || {};
  var notes, notesLength, C4 = 0.01186990, A = 1.059463094359;

  var microphone = root.microphone = {

    listening: false,

    resolution: 1024,

    smoothing: 0.3,

    max: 256,

    notes: [
      'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'
    ],

    noConflict: function() {
      root.microphone = previousMicrophone;
      return this;
    },

    initialize: function() {

      if (!_.isFunction(webkitAudioContext)) {
        throw 'Audio Error: Web Audio API is unable to find context.';
      }

      this.context = new webkitAudioContext();
      this.analyser = this.context.createAnalyser();

      this.analyser.smoothingTimeConstant = this.smoothing;
      this.analyser.fftSize = this.resolution;

      return this.trigger('initialize');

    },

    start: function() {

      if (_.isUndefined(this.context)) {
        this.initialize();
      }

      if (!_.isFunction(navigator.webkitGetUserMedia)) {
        throw 'Audio Error: Unable to identify getUserMedia.';
      }

      navigator.webkitGetUserMedia({ audio: true }, _.bind(function(stream) {

        this.playing = true;
        this.stream = stream;

        this.source = this.context.createMediaStreamSource(stream);
        this.source.connect(this.analyser);

      }, this));

      return this.trigger('start');

    },

    stop: function() {

      this.playing = false;

      if (this.stream) {
        this.stream.stop();
        this.source.disconnect(this.analyser);

        delete this.stream;
        delete this.source;
      }

      return this.trigger('stop');

    },

    update: function() {

      if (_.isUndefined(this.context) || !this.playing) {
        if (this.bands) {
          delete this.bands;
        }
        return this;
      }

      var array = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(array);
      // var array = new Float32Array(this.analyser.frequencyBinCount);
      // this.analyser.getFloatFrequencyData(array);

      this.bands = array.subarray(0, this.max);

      var peak, maxValue = -Infinity;
      // var min = this.analyser.minDecibels, max = this.analyser.maxDecibels;
      // var range = (max - min) || 1;
      _.each(this.bands, function(dbMag, freq) {
        // this.bands[freq] = Math.round(this.max * Math.max(dbMag - min, 0) / range);
        if (dbMag > maxValue) {
          maxValue = dbMag;
          peak = freq;
        }
      }, this);

      // If you want pitch.
      this.pitch = freqToNote(array, peak, maxValue);
      this.pitch.amplitude = this.bands[this.pitch.frequency];

      return this.trigger('update');

    },

    sample: function(amt) {

      var array = [];
      var atomic = Math.floor(this.bands.length / amt);
      for (var i = 0; i < amt; i++) {
        var phase = i * atomic;
        var average = 0;
        for (var j = phase; j < phase + atomic; j++) {
          average += this.bands[j];
        }
        average /= atomic;
        array.push(average);
      }

      return array;

    }

  };

  notes = microphone.notes;
  notesLength = notes.length;

  _.extend(microphone, Backbone.Events);

  function parabolic(f, x) {
    var xv = 0.5 * (f[x - 1] - f[x + 1]) / (f[x - 1] - 2 * f[x] + f[x + 1]) + x;
    var yv = f[x] - 1 / 4. * (f[x - 1] - f[x + 1]) * (xv - x);
    return [xv, yv];
  }

  function freqToNote(freq, peak, maxValue) {
    if (maxValue < -40) {
      return {};
    }
    var p = parabolic(freq, peak);
    var f = (p[0] / freq.length);
    var pos = Math.log(f / C4) / Math.log(A);
    var index = mod(Math.round(pos), notesLength);
    return {
      octave: 4 + Math.floor((pos / notesLength) + 0.01),
      note: notes[index],
      frequency: peak
    };
  }

  function mod(v, limit) {
    while (v < 0) {
      v += limit;
    }
    return v % limit;
  }

})();