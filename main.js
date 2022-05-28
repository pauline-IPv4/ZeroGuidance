import './style.css'

import * as THREE from 'three';

import { Camera } from 'three';

// SET UP ORBIT CONTROLS
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; 

const scene = new THREE.Scene(); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// first arg = perspective view based on 360
// snd arg = aspect ratio
// third arg = which objects are visible relative to the cam (view frustum)

// SET UP DOM TO USE FOR THE RENDER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'), 
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera); 

const geometry = new THREE.IcosahedronGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({color: 0x80ed99, wireframe: true});
const icosahed = new THREE.Mesh(geometry, material);

scene.add(icosahed);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(30, 30, 30);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);

// SHOWS LIGHT SOURCE POSITION IN BROWSER
scene.add(lightHelper, gridHelper); 

const controls = new OrbitControls(camera, renderer.domElement); 

function addStars(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}


Array(200).fill().forEach(addStars); 

const spaceTexture = new THREE.TextureLoader().load('waves.jpeg');
scene.background = spaceTexture;

const moonTexture = new THREE.TextureLoader().load('moon.jpeg');
const normalMapTexture = new THREE.TextureLoader().load('normalMap_moon.jpeg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map : moonTexture,
    normalMap: normalMapTexture
  })
  );

  scene.add(moon);

  function moveCamera(){

    // DIMENSION OF THE VIEWPORT
    // HOW FAR WE ARE FROM THE TOP OF PAGE
    const cursor = document.body.getBoundingClientRect().top; 
  
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    camera.position.z = cursor * -0.05; 
    camera.position.x = cursor * -0.2;
    camera.position.y = cursor * -0.05;
  }
  document.body.onscroll = moveCamera;

function animate(){

  requestAnimationFrame(animate); 
  icosahed.rotation.x += 0.01;
  icosahed.rotation.y += 0.005;
  icosahed.rotation.z += 0.01; 
  controls.update(); 
  renderer.render(scene, camera); 
}

animate();

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width  = canvas.clientWidth  * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
