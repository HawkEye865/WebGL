var THREE = require('three');
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
console.log("HEllo");
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

var worldWidth = 500, worldDepth = 500,
	worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

var mesh, texture;

var helper;

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);
// scene.fog = new THREE.FogExp2(0xbfd1e5, 0.002);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 20000);
camera.position.set(5, 5, 10);
// camera.position.set( 400, 200, 0 );

var controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 1000;
controls.maxDistance = 10000;

controls.maxPolarAngle = Math.PI / 2;

var data = generateHeight(worldWidth, worldDepth);

controls.target.y = data[worldHalfWidth + worldHalfDepth * worldWidth] + 500;
camera.position.y = controls.target.y + 2000;
camera.position.x = 2000;
controls.update();

var geometry = new THREE.PlaneBufferGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
geometry.rotateX(- Math.PI / 2);

var vertices = geometry.attributes.position.array;

for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {

	vertices[j + 1] = data[i] * 10;

}

texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
texture.wrapS = THREE.ClampToEdgeWrapping;
texture.wrapT = THREE.ClampToEdgeWrapping;

mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ map: texture }));
scene.add(mesh);

// var geometry = new THREE.ConeBufferGeometry(20, 100, 3);
// geometry.translate(0, 50, 0);
// geometry.rotateX(Math.PI / 2);
// helper = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial());
// scene.add(helper);
// var geometry = new THREE.SphereBufferGeometry(2, 32, 32);
// var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
// var sphere = new THREE.Mesh(geometry, material);
// sphere.castShadow = true;
// sphere.receiveShadow = true;
// sphere.position.setY(5);
// sphere.position.setZ(7);
// scene.add(sphere);

// var geometry = new THREE.BoxBufferGeometry(5, 5, 5);
// var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
// var cube = new THREE.Mesh(geometry, material);
// cube.castShadow = true;
// cube.receiveShadow = true;
// cube.position.setY(2);
// // cube.position.setZ(5);
// scene.add(cube);

// camera.lookAt(cube);

// var geometry = new THREE.BoxBufferGeometry(1000, 0, 1000);
// // var material = new THREE.MeshPhongMaterial({ color: 0x8B4513});
// var material = new THREE.MeshPhongMaterial({ color: 0xA9A9A9 });
// var plane = new THREE.Mesh(geometry, material);
// plane.castShadow = false;
// plane.receiveShadow = true;
// // plane.position.setY(-0.23);
// // plane.position.setZ(5);
// scene.add(plane);

// var light = new THREE.DirectionalLight(0xffffff);
// light.position.set(1, 1, 1);
// scene.add(light);

// var light = new THREE.DirectionalLight(0x002288);
// light.position.set(- 1, - 1, - 1);
// scene.add(light);

var light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// var light = new THREE.DirectionalLight(0xffffff, 1, 100);
// light.position.set(0, 1000, 30000); 			//default; light shining from top
// light.castShadow = true;            // default false
// scene.add(light);

// var light = new THREE.DirectionalLight( 0xffffff, 0.5, 100 );
// light.position.set( -5, 2, 10); 			//default; light shining from top
// light.castShadow = true;            // default false
// scene.add( light );

// light.shadow.mapSize.width = 512;  // default
// light.shadow.mapSize.height = 512; // default
// light.shadow.camera.near = 0.5;    // default
// light.shadow.camera.far = 500;

var size = 1000;
var divisions = 1000;

// var gridHelper = new THREE.GridHelper( size, divisions );
// gridHelper.receiveShadow = true;
// scene.add( gridHelper );

// var helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add( helper );
// controls.update();

// camera.position.z = 5;

var animate = function () {
	requestAnimationFrame(animate);

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
	controls.update();
	renderer.render(scene, camera);
};

animate();

function generateHeight(width, height) {

	var size = width * height, data = new Uint8Array(size),
		perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 10000 * Math.random() * 10000;

	for (var j = 0; j < 4; j++) {

		for (var i = 0; i < size; i++) {

			var x = i % width, y = ~ ~(i / width);
			data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);

		}

		quality *= 5;

	}

	return data;

}

function generateTexture(data, width, height) {

	// bake lighting into texture

	var canvas, canvasScaled, context, image, imageData, vector3, sun, shade;

	vector3 = new THREE.Vector3(0, 0, 0);

	sun = new THREE.Vector3(1, 1, 1);
	sun.normalize();

	canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	context = canvas.getContext('2d');
	context.fillStyle = '#000';
	context.fillRect(0, 0, width, height);

	image = context.getImageData(0, 0, canvas.width, canvas.height);
	imageData = image.data;

	for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {

		vector3.x = data[j - 2] - data[j + 2];
		vector3.y = 2;
		vector3.z = data[j - width * 2] - data[j + width * 2];
		vector3.normalize();

		shade = vector3.dot(sun);

		imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
		imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
		imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);

	}

	context.putImageData(image, 0, 0);

	// Scaled 4x

	canvasScaled = document.createElement('canvas');
	canvasScaled.width = width * 4;
	canvasScaled.height = height * 4;

	context = canvasScaled.getContext('2d');
	context.scale(4, 4);
	context.drawImage(canvas, 0, 0);

	image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
	imageData = image.data;

	for (var i = 0, l = imageData.length; i < l; i += 4) {

		var v = ~ ~(Math.random() * 5);

		imageData[i] += v;
		imageData[i + 1] += v;
		imageData[i + 2] += v;

	}

	context.putImageData(image, 0, 0);

	return canvasScaled;

}