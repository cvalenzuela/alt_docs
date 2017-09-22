/*
Alt Docs Volumetric Captures
*/

const THREE = require('three');

let path = './../models/mannequin/';
let container;
let camera, scene, renderer;
let mousePosition = { x: 0, y: 0 };
let previousMousePosition = { x: 0, y: 0 };
let isDragging = false;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let dollyObject;
let manager;
let focalLength = 25.734;

init();

function init() {
  // DOM
  container = document.createElement('div');
  document.body.appendChild(container);

  // camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // scene
  scene = new THREE.Scene();
  let ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);
  let directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(0, 0, 1).normalize();
  scene.add(directionalLight);

  // loading manager
  manager = new THREE.LoadingManager();

  manager.onProgress = xhr => {
    if (xhr.lengthComputable) {
      let percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  }

  manager.onLoad = () => {
    animate();
  }

  let mannequin = new THREE.JSONLoader(manager).load(path + 'json/' + 'mannequin.js', (geometry) => {
    let material = new THREE.MeshBasicMaterial();
    dollyObject = new THREE.Mesh(geometry, material);

    material.map = new THREE.TextureLoader(manager).load(path + 'json/' + 'mannequin.jpg');
    scene.add(dollyObject);
  })

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Event Listeners
  document.addEventListener('mousedown', function() { isDragging = true; });
  document.addEventListener('mouseup', function() { isDragging = false; });
  window.addEventListener('DOMMouseScroll', onScroll, false);
  window.addEventListener('mousewheel', onScroll, false);
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function onScroll(e) {
  e.deltaY > 0 ? focalLength += 4: focalLength -= 4;
  camera.setFocalLength(focalLength);
}

function onDocumentMouseMove(e) {
  let deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y
  };

  if (isDragging) {

    let deltaRotationQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        toRadians(deltaMove.y * 1),
        toRadians(deltaMove.x * 1),
        0,
        'XYZ'
      ));

    dollyObject.quaternion.multiplyQuaternions(deltaRotationQuaternion, dollyObject.quaternion);
  }

  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY
  };
}

function animate() {
  requestAnimationFrame(animate);
  dollyObject.rotation.y += 0.01;
  render();
}

function render() {
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}