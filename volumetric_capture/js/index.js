/*
Alt Docs Volumetric Captures
*/

const THREE = require('three');
const utils = require('./utils');

let objectName = 'mannequin';

let path = './models/' + objectName + '/json/';
let container, camera, scene, renderer, dollyObject, manager;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let loading = document.getElementById('loading');
let isDragging = false;

let render = () => {
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

let animate = () => {
  requestAnimationFrame(animate);
  dollyObject.rotation.y += 0.01;
  render();
}

let init = () => {

  // Append to DOM
  container = document.createElement('div');
  document.body.appendChild(container);

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Scene
  scene = new THREE.Scene();
  let ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);
  let directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(0, 0, 1).normalize();
  scene.add(directionalLight);

  // Loading manager
  manager = new THREE.LoadingManager();

  manager.onProgress = xhr => {
    if (xhr.lengthComputable) {
      let percentComplete = xhr.loaded / xhr.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  }

  manager.onLoad = () => {
    loading.style.display = 'none';
    animate();
  }

  // Object Loader
  let objectToLoad = new THREE.JSONLoader(manager).load(path + objectName + '.js', (geometry) => {
    let material = new THREE.MeshBasicMaterial();
    dollyObject = new THREE.Mesh(geometry, material);

    material.map = new THREE.TextureLoader(manager).load(path + objectName + '.jpg');
    scene.add(dollyObject);
  })

  // Render
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Event Listeners
  document.addEventListener('mousedown', () => { isDragging = true; });
  document.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('DOMMouseScroll', (e) => { utils.onScroll(e, camera) }, false);
  window.addEventListener('mousewheel', (e) => { utils.onScroll(e, camera) }, false);
  window.addEventListener('resize', (e) => { utils.onWindowResize(e, renderer, camera) }, false);
  document.addEventListener('mousemove', (e) => { utils.onDocumentMouseMove(e, dollyObject, isDragging) }, false);
}

// Start
init();