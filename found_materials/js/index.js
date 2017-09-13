// 311 Complaints

var key = 'pk.eyJ1IjoibWFwcGF1c2VyIiwiYSI6ImNqNXNrbXIyZDE2a2cyd3J4Ym53YWxieXgifQ.JENDJqKE1SLISxL3Q_T22w';

// Options for map
var options = {
  lat: 40.65548575094419,
  lng: -73.96030504056489,
  zoom: 12,
  style: 'mapbox://styles/mapbox/traffic-night-v2',
  pitch: 0
}

// Create an instance of Mapboxgl
var mappa = new Mappa('Mapboxgl', key);
var myMap;
var ready = false;

var canvas;
var complaints;

function preload(){
  // Load the data
  complaints = loadJSON('../data/complaints.json', function(data){
    ready = true;
  });
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  // Only redraw the meteorites when the map change and not every frame.
  myMap.onChange(drawComplaints);

  fill(109, 255, 0);
  stroke(100);
}

// The draw loop is fully functional but we are not using it for now.
function draw() {}

function drawComplaints() {
  // Clear the canvas
  clear();
  for (var c in complaints){
    var lat = complaints[c]["lat"];
    var lng = complaints[c]["lng"];
    var pos = myMap.latLngToPixel(lat, lng);
    ellipse(pos.x, pos.y, 10, 10);
  }
}