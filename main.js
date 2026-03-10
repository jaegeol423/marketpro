import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- 기본 설정 ----------------------------------------------------------------
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
canvasContainer.appendChild(renderer.domElement);

camera.position.set(0, 2, 8);

// --- 컨트롤 -----------------------------------------------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// --- 조명 -------------------------------------------------------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const pointLight = new THREE.PointLight(0x00f2ff, 2);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// --- 재질 (Materials) ------------------------------------------------------
const holoMaterial = new THREE.MeshPhongMaterial({
    color: 0x00f2ff,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
    emissive: 0x00f2ff,
    emissiveIntensity: 0.5
});

const hoverMaterial = new THREE.MeshPhongMaterial({
    color: 0xffaa00,
    wireframe: true,
    transparent: true,
    opacity: 0.8,
    emissive: 0xffaa00,
    emissiveIntensity: 1
});

// --- 인체 모델 및 히트박스 -----------------------------------------------------
const bodyGroup = new THREE.Group();
const hitboxGroup = new THREE.Group();
const bodyPartMapping = {}; 

function createPart(geo, name, category, pos, rot = [0,0,0], scale = [1,1,1]) {
    const mesh = new THREE.Mesh(geo, holoMaterial.clone());
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    mesh.scale.set(...scale);
    bodyGroup.add(mesh);

    // 투명 히트박스 (클릭 판정용)
    const hitbox = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ visible: false }));
    hitbox.position.set(...pos);
    hitbox.rotation.set(...rot);
    hitbox.scale.set(...scale);
    hitbox.name = name;
    hitboxGroup.add(hitbox);
    
    bodyPartMapping[name] = category;
    return mesh;
}

// 신체 부위 조립 (Anatomical Mannequin)
createPart(new THREE.CapsuleGeometry(0.3, 0.3), 'head', '목', [0, 3.8, 0]); // 머리
createPart(new THREE.CapsuleGeometry(0.5, 0.8), 'chest', '어깨', [0, 2.8, 0]); // 가슴/어깨
createPart(new THREE.CapsuleGeometry(0.4, 0.5), 'back', '등', [0, 2.0, 0]); // 허리/등
createPart(new THREE.CapsuleGeometry(0.15, 0.8), 'arm_l', '팔/손목', [-0.9, 2.6, 0], [0,0,0.2]); // 왼팔
createPart(new THREE.CapsuleGeometry(0.15, 0.8), 'arm_r', '팔/손목', [0.9, 2.6, 0], [0,0,-0.2]); // 오른팔
createPart(new THREE.CapsuleGeometry(0.22, 1.2), 'leg_l', '다리', [-0.3, 0.6, 0]); // 왼다리
createPart(new THREE.CapsuleGeometry(0.22, 1.2), 'leg_r', '다리', [0.3, 0.6, 0]); // 오른다리

scene.add(bodyGroup);
scene.add(hitboxGroup);

// --- 스트레칭 데이터 ----------------------------------------------------------
const stretches = [
    { bodyPart: '목', title: '거북목 스트레칭', description: '턱을 당겨 목 뒤쪽을 늘려주는 느낌으로 15초 유지하세요.' },
    { bodyPart: '어깨', title: '어깨 으쓱하기', description: '양 어깨를 귀 쪽으로 최대한 끌어올렸다가 천천히 내리기를 반복합니다.' },
    { bodyPart: '등', title: '고양이-소 자세', description: '네발 기기 자세에서 등을 둥글게 말았다가 오목하게 만들기를 반복합니다.' },
    { bodyPart: '팔/손목', title: '손목 굴곡/신전', description: '팔을 앞으로 뻗어 손가락을 위, 아래로 당겨 손목을 스트레칭합니다.' },
    { bodyPart: '다리', title: '장요근 스트레칭', description: '한쪽 무릎을 꿇고 다른 쪽 다리를 앞으로 뻗어 골반 앞쪽을 늘려줍니다.' },
];

// --- 스트레칭 카드 표시 -------------------------------------------------------
const cardContainer = document.querySelector('.card-container');

function displayStretches(filter = 'all') {
    cardContainer.innerHTML = '';
    const filteredStretches = filter === 'all' ? stretches : stretches.filter(s => s.bodyPart === filter);

    filteredStretches.forEach(stretch => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h3>${stretch.title}</h3><p>${stretch.description}</p>`;
        cardContainer.appendChild(card);
    });
}

// --- 레이캐스팅 및 이벤트 ----------------------------------------------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function updateMouse(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onMouseMove(event) {
    updateMouse(event);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(hitboxGroup.children);

    // 마우스 호버 효과
    bodyGroup.children.forEach(child => child.material = holoMaterial.clone());
    if (intersects.length > 0) {
        const index = hitboxGroup.children.indexOf(intersects[0].object);
        bodyGroup.children[index].material = hoverMaterial;
    }
}

function onClick(event) {
    updateMouse(event);
    raycaster.setFromCamera(mouse, camera); 
    const intersects = raycaster.intersectObjects(hitboxGroup.children);

    if (intersects.length > 0) {
        const category = bodyPartMapping[intersects[0].object.name];
        displayStretches(category);
        controls.autoRotate = false; // 클릭 시 자동 회전 중지
    }
}

document.getElementById('show-all-btn').addEventListener('click', () => {
    displayStretches('all');
    controls.autoRotate = true;
});

canvasContainer.addEventListener('mousemove', onMouseMove);
canvasContainer.addEventListener('click', onClick);

// --- 애니메이션 및 리사이즈 ---------------------------------------------------
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
});

// --- 초기화 ----------------------------------------------------------------
displayStretches();
animate();
