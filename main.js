import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const stretches = [
  { id: 1, category: 'neck', title: '넥 사이드 스트레칭', desc: '목 옆쪽 근육을 이완시켜 긴장을 풀어줍니다.', steps: '1. 정면을 보고 서거나 앉습니다. 2. 한 손으로 머리 반대편을 잡고 어깨 방향으로 지긋이 당깁니다. 3. 15초간 유지 후 반대쪽도 실시합니다.' },
  { id: 2, category: 'neck', title: '거북목 예방 스트레칭', desc: '목 뒤쪽 근육을 강화하고 자세를 교정합니다.', steps: '1. 턱을 몸쪽으로 가볍게 당깁니다. 2. 뒤통수가 뒤로 밀린다는 느낌으로 5초간 유지합니다. 3. 10회 반복합니다.' },
  { id: 3, category: 'shoulder', title: '크로스 암 스트레칭', desc: '어깨 뒤쪽 근육을 시원하게 풀어줍니다.', steps: '1. 한쪽 팔을 반대편 어깨 쪽으로 뻗습니다. 2. 다른 팔로 팔꿈치를 감싸 몸쪽으로 당깁니다. 3. 20초간 유지 후 교대합니다.' },
  { id: 4, category: 'shoulder', title: '어깨 회전 스트레칭', desc: '어깨 관절의 가동 범위를 넓혀줍니다.', steps: '1. 양손을 어깨 위에 올립니다. 2. 팔꿈치로 큰 원을 그리듯 천천히 회전시킵니다. 3. 앞뒤로 각각 10회 실시합니다.' },
  { id: 5, category: 'back', title: '고양이 자세', desc: '척추 마디마디를 이완시키고 유연성을 높입니다.', steps: '1. 네발 기기 자세를 취합니다. 2. 숨을 내쉬며 등을 둥글게 말고 시선은 배꼽을 봅니다. 3. 숨을 들이마시며 허리를 낮추고 시선은 정면을 봅니다.' },
  { id: 6, category: 'back', title: '코브라 자세', desc: '허리 근육을 이완하고 척추를 폅니다.', steps: '1. 바닥에 엎드립니다. 2. 손으로 바닥을 밀며 상체를 천천히 들어 올립니다. 3. 어깨가 귀와 멀어지도록 유지하며 15초간 버팁니다.' },
  { id: 7, category: 'wrist', title: '손목 굴곡 스트레칭', desc: '손목과 전완근의 긴장을 완화합니다.', steps: '1. 팔을 앞으로 쭉 뻗고 손바닥이 정면을 향하게 합니다. 2. 반대 손으로 손가락을 몸쪽으로 당깁니다. 3. 15초간 유지 후 반대쪽도 실시합니다.' },
  { id: 8, category: 'leg', title: '햄스트링 스트레칭', desc: '허벅지 뒤쪽 근육을 유연하게 만듭니다.', steps: '1. 한쪽 다리를 앞으로 내밀고 발가락을 세웁니다. 2. 상체를 천천히 숙이며 허벅지 뒤쪽의 자극을 느낍니다. 3. 20초간 유지 후 교대합니다.' }
];

// Scene Setup
const container = document.getElementById('three-canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
const mainLight = new THREE.PointLight(0x00f2ff, 10);
mainLight.position.set(10, 10, 10);
scene.add(mainLight);

// Hologram Material
const hologramMaterial = new THREE.MeshPhongMaterial({
  color: 0x00f2ff,
  wireframe: true,
  transparent: true,
  opacity: 0.2,
  emissive: 0x00f2ff,
  emissiveIntensity: 0.8,
  side: THREE.DoubleSide
});

const bodyGroup = new THREE.Group();

function createBodyPart(geometry, name, pos, rot = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, hologramMaterial.clone());
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  mesh.name = name;
  bodyGroup.add(mesh);
  return mesh;
}

// Anatomical Modeling
// Head & Neck
createBodyPart(new THREE.SphereGeometry(0.35, 32, 32), 'neck', [0, 3.8, 0]);
createBodyPart(new THREE.CylinderGeometry(0.12, 0.15, 0.3), 'neck', [0, 3.4, 0]);

// Torso (V-shape)
createBodyPart(new THREE.CapsuleGeometry(0.5, 0.8, 4, 16), 'back', [0, 2.7, 0]); // Upper torso
createBodyPart(new THREE.CapsuleGeometry(0.35, 0.4, 4, 16), 'back', [0, 2.1, 0]); // Waist
createBodyPart(new THREE.CapsuleGeometry(0.45, 0.3, 4, 16), 'leg', [0, 1.6, 0]); // Hips

// Arms
const armY = 3.0;
const armDist = 0.7;
// Shoulders
createBodyPart(new THREE.SphereGeometry(0.18, 16, 16), 'shoulder', [-armDist, armY, 0]);
createBodyPart(new THREE.SphereGeometry(0.18, 16, 16), 'shoulder', [armDist, armY, 0]);

// Upper Arms
createBodyPart(new THREE.CapsuleGeometry(0.12, 0.6, 4, 12), 'shoulder', [-0.9, armY-0.4, 0], [0, 0, 0.2]);
createBodyPart(new THREE.CapsuleGeometry(0.12, 0.6, 4, 12), 'shoulder', [0.9, armY-0.4, 0], [0, 0, -0.2]);

// Lower Arms & Hands
createBodyPart(new THREE.CapsuleGeometry(0.1, 0.5, 4, 12), 'wrist', [-1.05, armY-1.0, 0], [0, 0, 0.1]);
createBodyPart(new THREE.CapsuleGeometry(0.1, 0.5, 4, 12), 'wrist', [1.05, armY-1.0, 0], [0, 0, -0.1]);
createBodyPart(new THREE.SphereGeometry(0.08, 8, 8), 'wrist', [-1.1, armY-1.4, 0]);
createBodyPart(new THREE.SphereGeometry(0.08, 8, 8), 'wrist', [1.1, armY-1.4, 0]);

// Legs
const legX = 0.25;
const legY = 1.0;
// Thighs
createBodyPart(new THREE.CapsuleGeometry(0.22, 0.8, 4, 12), 'leg', [-legX, legY+0.2, 0]);
createBodyPart(new THREE.CapsuleGeometry(0.22, 0.8, 4, 12), 'leg', [legX, legY+0.2, 0]);
// Calves
createBodyPart(new THREE.CapsuleGeometry(0.18, 0.9, 4, 12), 'leg', [-legX, legY-0.7, 0]);
createBodyPart(new THREE.CapsuleGeometry(0.18, 0.9, 4, 12), 'leg', [legX, legY-0.7, 0]);
// Feet
createBodyPart(new THREE.BoxGeometry(0.2, 0.1, 0.4), 'leg', [-legX, 0, 0.1]);
createBodyPart(new THREE.BoxGeometry(0.2, 0.1, 0.4), 'leg', [legX, 0, 0.1]);

scene.add(bodyGroup);

// Points Overlay for "HD Scanner" effect
const pointsMaterial = new THREE.PointsMaterial({ size: 0.015, color: 0x00f2ff });
bodyGroup.children.forEach(mesh => {
  const points = new THREE.Points(mesh.geometry, pointsMaterial);
  points.position.copy(mesh.position);
  points.rotation.copy(mesh.rotation);
  scene.add(points);
});

camera.position.set(0, 2, 8);

// Raycaster Setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

container.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(bodyGroup.children);

  if (intersects.length > 0) {
    const partName = intersects[0].object.name;
    showStretches(partName);
    
    // Highlight effect
    const originalOpacity = hologramMaterial.opacity;
    intersects[0].object.material.opacity = 0.8;
    setTimeout(() => intersects[0].object.material.opacity = originalOpacity, 300);
  }
});

const infoPanel = document.getElementById('info-panel');
const stretchContent = document.getElementById('stretch-content');
const closeBtn = document.getElementById('close-panel');

function showStretches(category) {
  const filtered = stretches.filter(s => s.category === category);
  stretchContent.innerHTML = `<h1 style="color:#00f2ff; border-bottom: 2px solid #00f2ff; padding-bottom:10px">${category.toUpperCase()}</h1>`;
  
  filtered.forEach(s => {
    const item = document.createElement('div');
    item.className = 'stretch-item';
    item.innerHTML = `
      <h2>${s.title}</h2>
      <p>${s.desc}</p>
      <div class="steps">${s.steps}</div>
    `;
    stretchContent.appendChild(item);
  });

  infoPanel.classList.remove('hidden');
  controls.autoRotate = false; // Stop rotating when panel is open
}

closeBtn.addEventListener('click', () => {
  infoPanel.classList.add('hidden');
  controls.autoRotate = true;
});

// Animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
  
  // Dynamic material color update
  const newColor = next === 'dark' ? 0x00f2ff : 0x007bff;
  hologramMaterial.color.set(newColor);
  hologramMaterial.emissive.set(newColor);
});
