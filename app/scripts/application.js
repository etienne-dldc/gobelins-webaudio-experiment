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

var myp5 = new p5(sketch);
