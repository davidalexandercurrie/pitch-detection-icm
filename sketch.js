// Pitch variables
let crepe;
const voiceLow = 100;
const voiceHigh = 500;
let audioStream;

let midiNum;

// Circle variables
let circleSize = 42;
const scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Text variables
let currentNote = '';
let currentText = '';

// Osc variables
let oscs = [];
let currentFreq;
let currentPitch;


// Interval variales
let buttons = [];
const intervalCount = 10;
let buttonSize;
const intervalNames = ["-8","U","+m3","+M3","+d5","+P5","+d7","+m7","+M7","+8"];
const halfSteps = [0,0,3,4,6,7,9,10,11,0];
const intervalRatios = [.5,1,1.1892,1.2599,1.4142,1.4983,1.6818,1.7818,1.8897,2];

function setup() {
  createCanvas(600, 600);
  buttonSize = width/(intervalCount+2);

  audioContext = getAudioContext();
  getAudioContext().suspend();

  mic = new p5.AudioIn();
  mic.start(startPitch);

  for (let i = 0; i < intervalCount; i++) {
    oscs.push(new p5.Oscillator('sine'));
    oscs[i].start();
    buttons.push(new Button(i));
  }
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
    if (frequency && mic.getLevel() > .01) {
      currentFreq = frequency;
      select('#currentFreq').html(currentFreq);
      midiNum = freqToMidi(frequency);
      currentPitch = midiNum%12;
      currentNote = scale[currentPitch];
      select('#currentNote').html(currentNote);
    }
    getPitch();
  });
}

function draw() {
  background(240);
  drawStaff();
  select('#micVol').html(mic.getLevel());
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].drawButton();
    buttons[i].noteVal = (currentPitch+halfSteps[buttons[i].index])%12;
    if (buttons[i].pressed && mic.getLevel() > .006) {
      oscs[i].freq(currentFreq*buttons[i].interval);
      oscs[i].amp(mic.getLevel()*8);
      buttons[i].drawNote();
    } else {
      oscs[i].amp(0);
    }
    
  }
}

class Button {
  constructor(indexNum) {
    this.index = indexNum;
    this.name = intervalNames[this.index]
    this.xPos = buttonSize+buttonSize*this.index;
    this.yPos = buttonSize;
    this.pressed = false;
    this.interval = intervalRatios[this.index];
  }

  drawButton() {
    if (this.pressed) {
      fill(255,150,150);
    } else {
      fill(255);
    }
    strokeWeight(3);
    rect(this.xPos,this.yPos,buttonSize,buttonSize);
    textSize(20);
    fill(0);
    text(this.name, this.xPos+5,this.yPos+buttonSize/2);
  }

  drawNote() {
    text(this.noteVal,width*3/8,height/2);
    let defaultY = height/3+250;
    let defaultX = width*3/8;
    noFill();
    strokeWeight(5);
    switch (this.noteVal) {
      case 0:
        circle(defaultX, defaultY,25);
        line(defaultX-50,defaultY,defaultX+50,defaultY);
        break;
      case 1:
        circle(defaultX, defaultY,25);
        line(defaultX-50,defaultY,defaultX+50,defaultY);
        fill(0);
        textSize(50);
        text("#",defaultX-60,defaultY+15);
        break;
      case 2:
        circle(defaultX, defaultY-25,25);
        break;
      case 3:
        circle(defaultX, defaultY-25,25);
        fill(0);
        textSize(50);
        text("#",defaultX-60,defaultY-10);
        break;
      case 4:
        circle(defaultX, defaultY-50,25);
        break;
      case 5:
        circle(defaultX, defaultY-75,25);
        break;
      case 6:
        circle(defaultX, defaultY-75,25);
        fill(0);
        textSize(50);
        text("#",defaultX-60,defaultY-60);
        break;
      case 7:
        circle(defaultX, defaultY-100,25);
        break;
      case 8:
        circle(defaultX, defaultY-100,25);
        fill(0);
        textSize(50);
        text("#",defaultX-60,defaultY-85);
        break;
      case 9:
        circle(defaultX, defaultY-125,25);
        break;
      case 10:
        circle(defaultX, defaultY-125,25);
        fill(0);
        textSize(50);
        text("#",defaultX-60,defaultY-110);
        break;
      case 11:
        circle(defaultX, defaultY-150,25);
        break;
    }
    
  }

  checkPress() {
    let xPress = mouseX > this.xPos && mouseX < this.xPos+buttonSize;
    let yPress = mouseY > this.yPos && mouseY < this.yPos+buttonSize;
    if (yPress && xPress) {
      this.pressed = !this.pressed;
    }
  }
}

function mousePressed() {
  getAudioContext().resume(); 
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].checkPress();
  }
}

function drawStaff() {
  for (let i = 0; i < 5; i++) {
    line(width/4,height/3+50*i,width/2,height/3+50*i);
  }
}
