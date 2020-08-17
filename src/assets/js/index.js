import * as THREE from 'three/build/three.module';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PickHelper from './PickHelper';

import '../style/style.css';
import '../model/house.fbx';
import '../model/textures/Farm_house_D.jpg';
import '../model/textures/House_Side_D.jpg';
import '../model/textures/Roof_D.jpg';
import '../model/textures/grasslight-big.jpg';

function init() {
  //CANVAS
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //CANVAS

  //CAMERA
  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-20, 10, 10);
  //CAMERA

  //CONTROLS
  const controls = new OrbitControls(camera, canvas);
  controls.maxPolarAngle = Math.PI * 0.4;
  controls.minDistance = 10;
  controls.maxDistance = 60;
  //CONTROLS

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  //GROUND
  {
    const planeSize = 20;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('grasslight-big.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }
  //GROUND

  //LIGHT
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
  }
  //LIGHT

  //GEOMETRY MODELS

  const modelsArr = [];
  {
    const boxWidth = 0.2;
    const boxHeight = 2.2;
    const boxDepth = 1.2;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({
      color: 0x44aa88,
      opacity: 0.5,
      transparent: true
    });
    const cube = new THREE.Mesh(geometry, material);
    modelsArr.push(cube);
    cube.position.set(-3.3, 2.2, 1.5);
    scene.add(cube);
  }
  {
    const boxWidth = 1.4;
    const boxHeight = 1.5;
    const boxDepth = 0.2;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      opacity: 0.5,
      transparent: true
    });
    const cube = new THREE.Mesh(geometry, material);
    modelsArr.push(cube);
    cube.position.set(0.1, 2.5, -3.1);
    scene.add(cube);
  }

  //GEOMETRY MODELS

  //LOADER FBX
  const loader = new FBXLoader();
  //HOUSE MODEL
  {
    loader.load('house.fbx', (model) => {
      model.scale.x = model.scale.y = model.scale.z = 0.1;
      model.position.set(0, 5, 0);
      scene.add(model);
    });
  }
  //LOADER FBX

  //PICK ELEMENTS
  const pickPosition = { x: 0, y: 0 };
  const pickHelper = new PickHelper();
  clearPickPosition();

  function clearPickPosition() {
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width) * 2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
  }

  function render() {
    pickHelper.pick(pickPosition, modelsArr, camera);
    renderer.render(scene, camera);
  }

  window.addEventListener('mousemove', setPickPosition, false);

  animate();
}

init();
