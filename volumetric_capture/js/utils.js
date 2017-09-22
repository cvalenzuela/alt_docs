/*
Set of utils for Three.js
Cristobal Valenzuela
*/

const THREE = require('three');

// ----
// Change zoom based on mouse Scroll
// ----
let focalLength = 25.734;
let onScroll = (scroll, camera) => {
  scroll.deltaY > 0 ? focalLength += 4 : focalLength -= 4;
  camera.setFocalLength(focalLength);
}

// ----
// Move Object based on mouse movement
// ----
let mousePosition = { x: 0, y: 0 };
let previousMousePosition = { x: 0, y: 0 };
let onDocumentMouseMove = (mouse, object, isDragging) => {
  let deltaMove = {
    x: mouse.offsetX - previousMousePosition.x,
    y: mouse.offsetY - previousMousePosition.y
  };

  if (isDragging) {
    let deltaRotationQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        toRadians(deltaMove.y * 1),
        toRadians(deltaMove.x * 1),
        0,
        'XYZ'
      ));
    object.quaternion.multiplyQuaternions(deltaRotationQuaternion, object.quaternion);
  }

  previousMousePosition = {
    x: mouse.offsetX,
    y: mouse.offsetY
  };
}

// ----
// Recenter when window is resized
// ----
let onWindowResize = (e, renderer, camera) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// ----
// Angles to Radians
// ----
let toRadians = angle => {
  return angle * (Math.PI / 180);
}

// ----
// Radians to Degrees
// ----
let toDegrees = angle => {
  return angle * (180 / Math.PI);
}

module.exports = {
  onScroll: onScroll,
  onDocumentMouseMove: onDocumentMouseMove,
  onWindowResize: onWindowResize,
  toRadians: toRadians,
  toDegrees: toDegrees
}