/*
=====
311 Complaints
Alt-docs

Yueping Wang
Cristóbal Valenzuela
ITP
=====
*/

let p5 = require('p5');
let Mappa = require('mappa-mundi');
let key = 'pk.eyJ1IjoiY3ZhbGVuenVlbGEiLCJhIjoiY2l2ZzkweTQ3MDFuODJ5cDM2NmRnaG4wdyJ9.P_0JJXX6sD1oX2D0RQeWFA';
let timeline = require('./timeline');
let soundDict = require('./sounds');
let pS = require('./../node_modules/p5/lib/addons/p5.sound.min');

let options = {
  lat: 40.744,
  lng: -73.954,
  zoom: 11.6,
  style: 'mapbox://styles/cvalenzuela/cj65qbdrk6gxm2slnz6fyu6t2',
  pitch: 0
}
let mappa = new Mappa('Mapboxgl', key);
let myMap, canvas, complaints;
let sounds = [];
let currentPlaying = [];

let newp5 = new p5((p) => {

  p.preload = () => {
    complaints = p.loadJSON('./data/complaints.json');
    for (let i = 0; i < 24; i++) {
      sounds[i] = p.loadSound('./sounds/' + i + '.mp3');
    }
  }

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);

    p.fill(109, 255, 0);
    p.stroke(100);

  }

  p.draw = () => {

  };

  let drawComplaints = (lat, lng) => {
    let pos = myMap.latLngToPixel(lat, lng);
    p.ellipse(pos.x, pos.y, 10, 10);
  }

  let makeSound = (types, largest) => {
    for(let type in types){
      let soundIndex = soundDict[type];
      let sound = sounds[soundIndex];
      let volume = p.map(types[type], 0, largest, 0, 1);
      currentPlaying.push(sound);
      if (sound) {
        sound.setVolume(volume)
        sound.play();
      }
    }
  }

  let clearCanvas = () => {
    p.clear();
    currentPlaying.forEach((s)=>{
      s && s.stop();
    });
    currentPlaying = [];
  }

  window.makeSound = makeSound;
  window.clearCanvas = clearCanvas;
  window.drawComplaints = drawComplaints;

}, 'dom-elem');