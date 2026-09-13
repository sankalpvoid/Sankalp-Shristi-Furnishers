import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/geometries/RoundedBoxGeometry.js';

const mount = document.querySelector('#sofa-viewer');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e9dfd1');
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.setAttribute('aria-hidden', 'true');
mount.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 10;
controls.minPolarAngle = 0.75;
controls.maxPolarAngle = 1.55;
controls.target.set(0, 0.72, 0);
controls.addEventListener('change', render);

scene.add(new THREE.HemisphereLight('#ffffff', '#b6a18d', 1.65));
const key = new THREE.DirectionalLight('#fff5e6', 2.3);
key.position.set(-3.5, 6, 5);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.camera.left = -8;
key.shadow.camera.right = 8;
key.shadow.camera.top = 8;
key.shadow.camera.bottom = -8;
key.shadow.normalBias = 0.025;
scene.add(key);
const fill = new THREE.DirectionalLight('#fff8ed', 0.85);
fill.position.set(4, 4, -4);
scene.add(fill);
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: '#d8c9b6', roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

function weaveTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d');
  context.fillStyle = '#f0ece7';
  context.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 4) {
    context.fillStyle = y % 8 ? '#e0dbd5' : '#faf8f5';
    context.fillRect(0, y, 256, 1);
  }
  for (let x = 0; x < 256; x += 4) {
    context.fillStyle = x % 8 ? '#d9d5cf66' : '#fffefa77';
    context.fillRect(x, 0, 1, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  return texture;
}
function grainTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d');
  context.fillStyle = '#e7d5be';
  context.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 2) {
    const wave = Math.sin(x * 0.095) * 1.7 + Math.sin(x * 0.024) * 3;
    context.fillStyle = x % 6 ? '#957b6242' : '#674a334d';
    context.fillRect(x + wave, 0, x % 7 ? 1 : 2, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  return texture;
}

const fabricMaterial = new THREE.MeshStandardMaterial({
  color: '#713c39', map: weaveTexture(), roughness: 0.98, metalness: 0
});
const seamMaterial = fabricMaterial.clone();
seamMaterial.color.set('#4e2828');
const woodMaterial = new THREE.MeshStandardMaterial({
  color: '#a46a3e', map: grainTexture(), roughness: 0.58, metalness: 0
});
const darkWood = woodMaterial.clone();
darkWood.color.set('#67422d');
const shadowMaterial = new THREE.MeshStandardMaterial({ color: '#39241d', roughness: 0.9 });
const fabricColours = {
  Oxblood: '#713c39', Sand: '#c7b9a3', Olive: '#6d745c', Charcoal: '#474a49', 'Bring my own': '#9d998f'
};
const woodColours = {
  'Natural teak': '#a46a3e', 'Deep teak': '#68432e', 'Honey teak': '#bd8954'
};
const model = new THREE.Group();
scene.add(model);
let currentShape = '';let currentConfig = null;

function box(parent, width, height, depth, x, y, z, material, radius = 0.05) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 3, radius), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function leg(parent, x, z) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.045, 0.46, 10), woodMaterial);
  mesh.position.set(x, 0.25, z);
  mesh.castShadow = true;
  parent.add(mesh);
}
function cushion(parent, width, depth, x, z) {
  box(parent, width + 0.02, 0.13, depth + 0.01, x, 0.52, z, seamMaterial, 0.07);
  box(parent, width, 0.24, depth, x, 0.59, z, fabricMaterial, 0.105);
}
function backCushion(parent, width, x, z) {
  const shell = box(parent, width, 0.76, 0.29, x, 1.00, z, seamMaterial, 0.13);
  shell.rotation.x = -0.09;
  const face = box(parent, width - 0.035, 0.72, 0.26, x, 1.005, z + 0.022, fabricMaterial, 0.13);
  face.rotation.x = -0.09;
}
function arm(parent, x, side, extended = false) {
  const depth = extended ? 2.05 : 1.03;
  const centerZ = extended ? 0.38 : -0.12;
  box(parent, 0.11, 0.57, depth, x, 0.75, centerZ, woodMaterial, 0.04);
  box(parent, 0.16, 0.12, depth + 0.02, x, 1.10, centerZ, woodMaterial, 0.055);
  const supportZ = extended ? 1.35 : 0.30;
  box(parent, 0.09, 0.33, 0.10, x, 0.88, supportZ, woodMaterial, 0.025);
  if (!extended) box(parent, 0.08, 0.34, 0.09, x, 0.88, -0.55, woodMaterial, 0.025);
  leg(parent, x, extended ? 1.36 : 0.36);
  leg(parent, x, -0.55);
}
function build(shape, chaiseSide = 'Right') {
  model.traverse(object => { if (object.geometry) object.geometry.dispose(); });
  model.clear();
  const count = shape === '2 seater' ? 2 : 3;
  const seatWidth = 1.24;
  const width = count * seatWidth + 0.38;
  const isChaise = shape === 'L-shape';
  const chaiseIndex = chaiseSide === 'Left' ? 0 : count - 1;
  const left = -width / 2 + 0.19;
  const right = width / 2 - 0.19;
  box(model, width - 0.10, 0.19, 1.05, 0, 0.43, -0.12, darkWood, 0.04);
  box(model, width - 0.10, 0.11, 0.09, 0, 0.44, 0.45, woodMaterial, 0.025);
  box(model, width - 0.12, 0.12, 0.08, 0, 0.44, -0.67, woodMaterial, 0.025);
  box(model, width - 0.14, 0.65, 0.13, 0, 0.96, -0.62, woodMaterial, 0.035);
  for (let i = 0; i < count; i++) {
    const x = -((count - 1) * seatWidth) / 2 + i * seatWidth;
    if (isChaise && i === chaiseIndex) {
      box(model, seatWidth - 0.08, 0.18, 2.04, x, 0.43, 0.38, darkWood, 0.04);
      box(model, seatWidth - 0.06, 0.10, 0.09, x, 0.44, 1.39, woodMaterial, 0.025);
      cushion(model, seatWidth - 0.09, 1.94, x, 0.40);
      leg(model, x - 0.42, 1.35);
      leg(model, x + 0.42, 1.35);
    } else cushion(model, seatWidth - 0.09, 0.85, x, -0.10);
    backCushion(model, seatWidth - 0.08, x, -0.43);
  }
  arm(model, left, 'left', isChaise && chaiseSide === 'Left');
  arm(model, right, 'right', isChaise && chaiseSide === 'Right');
  // The front rail and the cushion count are deliberately distinct for each layout.
  currentShape = shape + ':' + chaiseSide;
  camera.position.set(isChaise && chaiseSide === 'Left' ? -3.5 : isChaise ? 3.5 : 3.2, 2.22, isChaise ? 4.95 : 4.35);
  controls.target.set(0, 0.72, isChaise ? 0.30 : -0.10);
  controls.update();
}
function resize() {
  const width = mount.clientWidth, height = mount.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  render();
}
function render() {
  if (!mount.hidden && mount.clientWidth) renderer.render(scene, camera);
}
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(mount);
export function updateSofaPreview(config) {
  mount.hidden = false;
  if (currentShape !== config.size + ':' + config.chaiseSide) build(config.size, config.chaiseSide);
  currentConfig = { ...config };
  fabricMaterial.color.set(fabricColours[config.fabric] || fabricColours.Oxblood);
  seamMaterial.color.copy(fabricMaterial.color).multiplyScalar(0.68);
  woodMaterial.color.set(woodColours[config.finish] || woodColours['Natural teak']);
  darkWood.color.copy(woodMaterial.color).multiplyScalar(0.63);
  mount.setAttribute('aria-label', `3D concept of a ${config.size} sofa${config.size === 'L-shape' ? ' with '+config.chaiseSide.toLowerCase()+' chaise' : ''} in ${config.fabric} fabric and ${config.finish}`);
  resize();
  render();
}
export function resetSofaCamera() {
  if (currentConfig) build(currentConfig.size, currentConfig.chaiseSide);
  render();
}
export function saveSofaView() {
  if (!currentConfig) return false;
  render();
  const link = document.createElement('a');
  link.href = renderer.domElement.toDataURL('image/png');
  link.download = `sankalp-shristi-${currentConfig.size.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-concept.png`;
  link.click();
  return true;
}
