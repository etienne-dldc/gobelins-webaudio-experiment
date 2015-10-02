var sketch = function( p ) {

  var song;
  var fft;

  p.preload = function() {
    song = p.loadSound('music/try-again.mp3');
  }

  p.setup = function() {
    p.createCanvas(710, 200);
    song.loop(); // song is ready to play during setup() because it was loaded during preload
    p.background(95, 143, 164);

    fft = new p5.FFT();
    fft.setInput(song);
  }

  p.draw = function() {
    var spectrum = fft.analyze();
    p.background(95, 143, 164);

    p.beginShape();
    p.vertex(0, p.height);
    for (var i = 0; i<spectrum.length; i++) {
      p.vertex(i, p.map(spectrum[i], 0, 255, p.height, 0) );
    }
    p.vertex(i + 1, p.height);
    p.endShape();
  }

};

var myp5 = new p5(sketch);
