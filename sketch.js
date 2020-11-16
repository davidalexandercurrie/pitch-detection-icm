// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
A game using pitch Detection with CREPE
=== */

// Pitch variables
let crepe;
const voiceLow = 100;
const voiceHigh = 500;
let audioStream;

// Circle variables
let circleSize = 42;
const scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Text variables
let goalNote = 0;
let currentNote = '';
let currentText = '';
let textCoordinates;

// Osc variables
let currentFreq;
let osc, oscFreq, oscAmp;
let osc2, oscFreq2, oscAmp2;
let osc3, oscFreq3, oscAmp3;


function setup() {
  createCanvas(410, 320);
  textCoordinates = [width / 2, 30];
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(startPitch);
  getAudioContext().suspend();
  osc = new p5.Oscillator('sine');
  osc2 = new p5.Oscillator('sine');
  osc3 = new p5.Oscillator('sine');
  

}

function startPitch() {
  pitch = ml5.pitchDetection('./model/', audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  select('#status').html('Model Loaded');
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    currentFreq = frequency;
    if (frequency) {
      
      let midiNum = freqToMidi(frequency);
      currentNote = scale[midiNum % 12];
      select('#currentNote').html(currentNote);
    }
    getPitch();
  });
}

function draw() {
    osc.freq(currentFreq);
    osc2.freq(currentFreq*3/2);
    osc3.freq(currentFreq*5/4);
  background(240);
  // Goal Circle is Blue
  noStroke();
  fill(0, 0, 255);
  goalHeight = map(goalNote, 0, scale.length - 1, 0, height);
  ellipse(width / 2, goalHeight, circleSize, circleSize);
  fill(255);
  text(scale[goalNote], width / 2 - 5, goalHeight + circleSize / 6);
  // Current Pitch Circle is Pink
  if (currentNote) {
    currentHeight = map(
      scale.indexOf(currentNote),
      0,
      scale.length - 1,
      0,
      height
    );
    fill(255, 0, 255);
    ellipse(width / 2, currentHeight, circleSize, circleSize);
    fill(255);
    text(
      scale[scale.indexOf(currentNote)],
      width / 2 - 5,
      currentHeight + circleSize / 6
    );
  }
}



function mousePressed() {
  userStartAudio();
  osc.start();
  osc2.start();
  osc3.start();

}
