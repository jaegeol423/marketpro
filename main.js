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
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;
controls.minDistance = 5;
controls.maxDistance = 15;

// Fresnel Shader Material (High-End Hologram Look)
const hologramShader = {
  uniforms: {
    "c": { type: "f", value: 1.0 },
    "p": { type: "f", value: 3.0 },
    glowColor: { type: "c", value: new THREE.Color(0x00f2ff) },
    viewVector: { type: "v3", value: camera.position }
  },
  vertexShader: `
    uniform vec3 viewVector;
    uniform float c;
    uniform float p;
    varying float intensity;
    void main() {
      vec3 vNormal = normalize( normalMatrix * normal );
      vec3 vNormel = normalize( normalMatrix * viewVector );
      intensity = pow( c - dot(vNormal, vNormel), p );
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    varying float intensity;
    void main() {
      vec3 glow = glowColor * intensity;
      gl_FragColor = vec4( glow, intensity );
    }
  `
};

const holoMaterial = new THREE.ShaderMaterial({
  uniforms: THREE.UniformsUtils.clone(hologramShader.uniforms),
  vertexShader: hologramShader.vertexShader,
  fragmentShader: hologramShader.fragmentShader,
  side: THREE.FrontSide,
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false
});

const bodyGroup = new THREE.Group();

function createPart(geo, name, pos, rot = [0, 0, 0], scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(geo, holoMaterial.clone());
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  mesh.scale.set(...scale);
  mesh.name = name;
  bodyGroup.add(mesh);
  return mesh;
}

// Muscular Humanoid Proportions
// Head & Neck
createPart(new THREE.SphereGeometry(0.35, 32, 32), 'neck', [0, 3.8, 0]);
createPart(new THREE.CylinderGeometry(0.12, 0.15, 0.4), 'neck', [0, 3.4, 0]);

// Upper Body (Muscular Chest & Back)
createPart(new THREE.BoxGeometry(1.0, 1.0, 0.6), 'back', [0, 2.8, 0]); // Chest block
createPart(new THREE.CapsuleGeometry(0.48, 0.7, 4, 16), 'back', [0, 2.7, 0]); // Thorax
createPart(new THREE.CapsuleGeometry(0.35, 0.5, 4, 16), 'back', [0, 2.1, 0]); // Abs/Waist
createPart(new THREE.CapsuleGeometry(0.45, 0.3, 4, 16), 'leg', [0, 1.6, 0]); // Hips

// Arms
const armY = 3.1;
const armX = 0.75;
createPart(new THREE.SphereGeometry(0.2, 16, 16), 'shoulder', [-armX, armY, 0]); // Left Shoulder
createPart(new THREE.SphereGeometry(0.2, 16, 16), 'shoulder', [armX, armY, 0]); // Right Shoulder

createPart(new THREE.CapsuleGeometry(0.15, 0.7, 4, 12), 'shoulder', [-1.0, armY-0.4, 0], [0, 0, 0.1]); // L-Bicep
createPart(new THREE.CapsuleGeometry(0.15, 0.7, 4, 12), 'shoulder', [1.0, armY-0.4, 0], [0, 0, -0.1]); // R-Bicep

createPart(new THREE.CapsuleGeometry(0.12, 0.6, 4, 12), 'wrist', [-1.15, armY-1.2, 0]); // L-Forearm
createPart(new THREE.CapsuleGeometry(0.12, 0.6, 4, 12), 'wrist', [1.15, armY-1.2, 0]); // R-Forearm

// Legs (Detailed quads)
const legX = 0.3;
createPart(new THREE.CapsuleGeometry(0.25, 1.0, 4, 12), 'leg', [-legX, 1.1, 0], [0.1, 0, 0]); // L-Thigh
createPart(new THREE.CapsuleGeometry(0.25, 1.0, 4, 12), 'leg', [legX, 1.1, 0], [0.1, 0, 0]); // R-Thigh
createPart(new THREE.CapsuleGeometry(0.2, 0.9, 4, 12), 'leg', [-legX, -0.1, 0]); // L-Calf
createPart(new THREE.CapsuleGeometry(0.2, 0.9, 4, 12), 'leg', [legX, -0.1, 0]); // R-Calf

scene.add(bodyGroup);

// Environment: Glowing Grid Floor
const gridHelper = new THREE.GridHelper(10, 20, 0x00f2ff, 0x003333);
gridHelper.position.y = -0.8;
scene.add(gridHelper);

// Environment: Ground Ring
const ringGeo = new THREE.RingGeometry(0.8, 1.0, 32);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
ring.position.y = -0.79;
scene.add(ring);

// Rays / Light Beams
const beamCount = 5;
for(let i=0; i<beamCount; i++) {
  const beamGeo = new THREE.CylinderGeometry(0.01, 0.01, 10, 8);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.1 });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.set((Math.random()-0.5)*4, 4, (Math.random()-0.5)*4);
  scene.add(beam);
}

camera.position.set(0, 2, 8);

// Interaction
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
    
    // Pulse effect
    const obj = intersects[0].object;
    obj.material.uniforms.c.value = 2.0;
    setTimeout(() => obj.material.uniforms.c.value = 1.0, 300);
  }
});

const infoPanel = document.getElementById('info-panel');
const stretchContent = document.getElementById('stretch-content');
const closeBtn = document.getElementById('close-panel');

function showStretches(category) {
  const filtered = stretches.filter(s => s.category === category);
  stretchContent.innerHTML = `
    <div style="border-left: 5px solid #00f2ff; padding-left: 20px; margin-bottom: 30px;">
      <h1 style="color:#00f2ff; margin:0; font-size:2.5rem;">${category.toUpperCase()}</h1>
      <p style="opacity:0.6;">부위별 스캔 완료. 스트레칭 가이드를 확인하세요.</p>
    </div>
  `;
  
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
  controls.autoRotate = false;
}

closeBtn.addEventListener('click', () => {
  infoPanel.classList.add('hidden');
  controls.autoRotate = true;
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  
  // Update shader uniforms for view vector
  bodyGroup.children.forEach(mesh => {
    if (mesh.material.uniforms) {
      mesh.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, mesh.position);
    }
  });

  renderer.render(scene, camera);
}

animate();

// Resize
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
  
  const color = next === 'dark' ? 0x00f2ff : 0x007bff;
  bodyGroup.children.forEach(mesh => {
    if(mesh.material.uniforms) mesh.material.uniforms.glowColor.value.set(color);
  });
});
