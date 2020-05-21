var THREE = require('three');
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);
scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(5, 5, 10);
// camera.position.set( 400, 200, 0 );

var controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 1;
controls.maxDistance = 500;

controls.maxPolarAngle = Math.PI / 2;

var geometry = new THREE.BoxBufferGeometry( 3, 3, 3 );
var material = new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true });
var cube = new THREE.Mesh(geometry, material);
cube.position.setY(1.5);
cube.updateMatrix();
scene.add(cube);

camera.lookAt(cube);

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1);
scene.add(light);

var light = new THREE.DirectionalLight(0x002288);
light.position.set(- 1, - 1, - 1);
scene.add(light);

var light = new THREE.AmbientLight(0x222222);
scene.add(light);

var size = 20;
var divisions = 20;

var gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

// controls.update();

// camera.position.z = 5;

var animate = function () {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
};

animate();