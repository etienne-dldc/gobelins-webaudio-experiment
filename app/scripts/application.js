var sketch = function( p ) {

  var song, fft, mic, analyzer;
  var maxSpectre = false;
  var spectrumTimeData = [];

  p.preload = function() {
    song = p.loadSound('music/hello.mp3');
    //song = p.loadSound('music/try-again.mp3');
    //song = p.loadSound('music/le-petit-ver-de-terre.mp3');
    //song = p.loadSound('music/nos-affaires.mp3');
  }

  p.setup = function() {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.background(95, 143, 164);

    //mic = new p5.AudioIn();
    //mic.start();
    song.loop();

    fft = new p5.FFT();
    fft.setInput(song);

    analyzer = new p5.Amplitude();
    analyzer.setInput(song);

  }

  function movingAverage(data, size) {
    var result = [];
    for (var i = 0; i<data.length; i++) {
      var start = size/2;
      var end = size/2;
      if (i < size/2) {
        start = i;
      } else
      if (i > data.length-end) {
        end = data.length - i;
      }
      //console.log(start, end);
      var sum = 0;
      for (var j = i-start; j < i+end; j++) {
        sum += data[j];
      }
      result.push(sum/(start + end + 1));
    }
    return result;
  }

  function timeAverage(data) {
    var nbOfTimeElem = data.length;
    var nbOfPoint = data[0].length;
    var result = [];
    for (var i = 0; i < nbOfPoint; i++) {
      var sum = 0;
      for (var j = 0; j < nbOfTimeElem; j++) {
        sum += data[j][i];
      }
      result.push(sum/nbOfTimeElem);
    }
    return result;
  }

  function displaySpectre(data) {

    var vol = analyzer.getLevel();
    p.colorMode(p.HSB, 100);
    var c = p.color(0, 50, 20 + 60-(60*vol) );
    p.background(c);
    p.noFill();
    p.stroke(0, 0, 100);
    p.strokeWeight(10);
    p.beginShape();
    p.curveVertex(-1, p.height);
    for (var i = 0; i<data.length; i++) {
      p.curveVertex( p.map(i, 0, data.length, 0, p.width), p.map(data[i], 0, 255, p.height, 0) );
    }
    p.curveVertex(p.width+1, p.height);
    p.endShape();
  }

  p.draw = function() {
    var spectrum = fft.analyze();
    if (maxSpectre !== false) {
      spectrum = spectrum.slice(0, maxSpectre);
    }
    var spectrumAverage = movingAverage(spectrum, 40);
    spectrumTimeData.push(spectrumAverage);
    if (spectrumTimeData.length == 10) {
      var spectrumAverageTime = timeAverage(spectrumTimeData);
      displaySpectre(spectrumAverageTime);
      spectrumTimeData.shift();
    }
  }

};

var sketchBis = function( p ) {

  var song, fft, mic, analyzer;
  var maxSpectre = 800;
  var spectrumTimeData = [];
  var groupData = [];
  var hue = 0;

  p.preload = function() {
    song = p.loadSound('music/hello.mp3');
  }

  p.setup = function() {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.background(95, 143, 164);
    song.loop();

    fft = new p5.FFT();
    fft.setInput(song);

    analyzer = new p5.Amplitude();
    analyzer.setInput(song);

  }

  function movingAverage(data, size) {
    var result = [];
    for (var i = 0; i<data.length; i += size) {
      var start = i;
      var end = start + size;
      var sum = 0;
      for (var j = start; j < end; j++) {
        sum += data[j];
      }
      result.push(sum/size);
    }
    return result;
  }

  function timeAverage(data) {
    var nbOfTimeElem = data.length;
    var nbOfPoint = data[0].length;
    var result = [];
    for (var i = 0; i < nbOfPoint; i++) {
      var sum = 0;
      for (var j = 0; j < nbOfTimeElem; j++) {
        sum += data[j][i];
      }
      result.push(sum/nbOfTimeElem);
    }
    return result;
  }

  function displayGroup(data) {

    var blockWidth = p.width/(data.length-1);

    var vol = analyzer.getLevel();
    p.colorMode(p.HSB, 100);
    hue += 0.1;
    hue = hue % 255;
    var c = p.color(hue, 50, 20 + 60-(60*vol) );
    p.background(c);

    for (var i = 0; i < data.length; i++) {
      // var average = 0;
      // for (var j = 0; j < groupData.length; j++) {
      //   average += groupData[j][i];
      // }
      // average = average/groupData.length;
      //
      // var diff = p.abs(average - data[i]) * 2;
      // diff = diff > 255 ? 255 : diff;

      var arr = [];
      for (var j = 0; j < groupData.length; j++) {
        arr.push(groupData[j][i]);
      }
      var max = p.max(arr);

      // Display block
      var left = blockWidth*i;
      var height = p.map(data[i], 0, 255, 0, p.height);
      p.colorMode(p.RGB, 255);
      p.noStroke();

      var c = p.color(255, 255, 255, p.map(data[i], 0, max, 0, 255) );
      p.fill(c);
      p.rect(left, p.height - height, blockWidth, height );

      c = p.color(255, 255, 255, 50);
      p.fill(c);
      p.rect(left, 0, blockWidth, p.height - p.map(max, 0, 255, 0, p.height) );

      c = p.color(255, 255, 255, 255);
      p.fill(c);
      p.rect(left, p.height - p.map(max, 0, 255, 0, p.height) - 5, blockWidth, 5 );
    }
  }

  p.draw = function() {

    if ( song.isPlaying() ) { // .isPlaying() returns a boolean
      var spectrum = fft.analyze();
    } else {
      var spectrum = [];
      for (var i = 0; i < maxSpectre; i++) {
        spectrum[i] = 0;
      }
    }

    if (maxSpectre !== false) {
      spectrum = spectrum.slice(0, maxSpectre);
    }
    var spectrumAverage = movingAverage(spectrum, 20);
    spectrumTimeData.push(spectrumAverage);
    if (spectrumTimeData.length == 10) {
      var spectrumAverageTime = timeAverage(spectrumTimeData);
      groupData.push(spectrumAverageTime);
      if (groupData.length > 40) {
        groupData.shift();
      }
      displayGroup(spectrumAverageTime);
      spectrumTimeData.shift();
    }
  }

  p.mousePressed = function() {
    if ( song.isPlaying() ) { // .isPlaying() returns a boolean
      song.pause();
    } else {
      song.play();
    }
  }


};

var myp5 = new p5(sketchBis);
