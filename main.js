import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- 기본 설정 ----------------------------------------------------------------
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

camera.position.set(0, 0, 25); 

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enablePan = false;
controls.enableZoom = true;
controls.update();

const textureLoader = new THREE.TextureLoader();
const bodyGroup = new THREE.Group();
const clickTargets = new THREE.Group();
scene.add(bodyGroup);
scene.add(clickTargets);

// --- 크로마키 쉐이더 (초록색 배경 제거 최적화) ------------------------------------
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D map;
    uniform vec3 keyColor;
    uniform float similarity;
    uniform float smoothness;
    varying vec2 vUv;
    void main() {
        vec4 videoColor = texture2D(map, vUv);
        float d = distance(videoColor.rgb, keyColor);
        float alpha = smoothstep(similarity, similarity + smoothness, d);
        gl_FragColor = vec4(videoColor.rgb, videoColor.a * alpha);
        if(gl_FragColor.a < 0.1) discard;
    }
`;

textureLoader.load(
    'body.png', 
    (texture) => {
        console.log('Texture loaded successfully');
        const aspect = texture.image.width / texture.image.height;
        const height = 35; 
        const width = height * aspect;
        
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: texture },
                keyColor: { value: new THREE.Color(0x00ff00) },
                similarity: { value: 0.35 },
                smoothness: { value: 0.05 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const bodyPlane = new THREE.Mesh(geometry, material);
        bodyGroup.add(bodyPlane);

        createClickTargets();
    },
    undefined,
    (err) => {
        console.error('Error loading body.png:', err);
        const fallbackGeo = new THREE.PlaneGeometry(15, 30);
        const fallbackMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        bodyGroup.add(new THREE.Mesh(fallbackGeo, fallbackMat));
    }
);

const bodyPartMapping = {}; 

function createClickTargets() {
    const targetMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00f2ff, 
        transparent: true, 
        opacity: 0.0,
        visible: true 
    });

    // 모든 히트박스 크기를 작게 통일 (기존 대비 축소)
    const unifiedSize = 0.8;

    // 요청하신 대로 정밀 좌표 재조정 (손목과 무릎을 더 중앙으로)
    const targets = {
        'neck': { pos: [0, 12.0, 0.2], part: '목' },
        'shoulder_l': { pos: [4.2, 9.0, 0.2], part: '어깨' },
        'shoulder_r': { pos: [-4.2, 9.0, 0.2], part: '어깨' },
        'waist': { pos: [0, 4.0, 0.2], part: '등' },
        'wrist_l': { pos: [4.0, 3.0, 0.2], part: '팔/손목' },   // 중앙 쪽으로 더 이동 (5.0 -> 4.0)
        'wrist_r': { pos: [-4.0, 3.0, 0.2], part: '팔/손목' }, // 중앙 쪽으로 더 이동 (-5.0 -> -4.0)
        'knee_l': { pos: [1.2, -3.0, 0.2], part: '다리' },     // 중앙 쪽으로 더 이동 (1.8 -> 1.2)
        'knee_r': { pos: [-1.2, -3.0, 0.2], part: '다리' },    // 중앙 쪽으로 더 이동 (-1.8 -> -1.2)
    };

    for (const [name, data] of Object.entries(targets)) {
        const geo = new THREE.SphereGeometry(unifiedSize, 16, 16);
        const mesh = new THREE.Mesh(geo, targetMaterial.clone());
        mesh.position.set(...data.pos);
        mesh.name = name;
        clickTargets.add(mesh);
        bodyPartMapping[name] = data.part;
    }
}

// --- 스트레칭 전문 데이터 (해부학적 근거 보강 및 애니메이션 추가) --------------------------------------
const stretches = [
    { 
        bodyPart: '목', 
        title: '경추 심부 굴곡근 강화 및 이완', 
        animClass: 'anim-neck',
        description: '장시간 모니터 사용으로 인해 단축된 사각근과 흉쇄유돌근을 이완하고, 경추 정렬을 바로잡아 거북목 증후군을 완화합니다.',
        steps: '정면 응시 후 턱을 수평하게 당기기(Chin-tuck) -> 10초 유지 -> 머리 옆으로 기울이기'
    },
    { 
        bodyPart: '어깨', 
        title: '회전근개 가동성 확보 및 대흉근 신전', 
        animClass: 'anim-shoulder',
        description: '말린 어깨(라운드 숄더)를 교정하기 위해 가슴 앞쪽 대흉근을 열어주고, 견갑골 주변 근육의 안정성을 높입니다.',
        steps: '벽 모서리에 양팔 ㄴ자로 대기 -> 가슴 전방으로 밀기 -> 견갑골 모으며 20초 유지'
    },
    { 
        bodyPart: '등', 
        title: '척추 기립근 및 요방형근 릴리즈', 
        animClass: 'anim-back',
        description: '척추 마디마디 공간을 확보하여 요추 압박을 줄이고, 허리 통증 원인인 요방형근과 광배근을 이완합니다.',
        steps: '네발 기기 자세 -> 등 둥글게 말기(고양이) -> 배꼽 낮추고 시선 정면(소) -> 10회 반복'
    },
    { 
        bodyPart: '팔/손목', 
        title: '수근관 증후군 예방 및 전완근 이완', 
        animClass: 'anim-wrist',
        description: '손목 터널 내 정중신경 압박을 완화하고, 키보드/마우스 사용으로 긴장된 전완 굴곡근을 스트레칭합니다.',
        steps: '팔 앞으로 뻗고 손바닥 세우기 -> 반대 손으로 손가락 당기기 -> 15초간 유지'
    },
    { 
        bodyPart: '다리', 
        title: '좌골신경통 완화 및 이상근/햄스트링 이완', 
        animClass: 'anim-leg',
        description: '골반 깊숙한 곳의 이상근을 이완하여 신경 압박을 해소하고, 골반 불균형을 교정합니다.',
        steps: '누워서 한쪽 다리 숫자 4 모양으로 올리기 -> 아래쪽 허벅지 가슴쪽으로 당기기 -> 20초 유지'
    },
];

const cardContainer = document.querySelector('.card-container');

function displayStretches(filter = 'all') {
    cardContainer.innerHTML = '';
    const filteredStretches = filter === 'all' ? stretches : stretches.filter(s => s.bodyPart === filter);

    filteredStretches.forEach(stretch => {
        const card = document.createElement('div');
        card.className = `card ${stretch.animClass}`;
        
        // 동작 가이드 시각화 요소 생성
        const actionHtml = `
            <div class="action-container">
                <div class="action-body">
                    <div class="action-head"></div>
                    ${stretch.bodyPart === '팔/손목' ? '<div class="action-hand"></div>' : ''}
                </div>
                <div style="position:absolute; bottom:5px; font-size:0.7rem; color:var(--primary-color); opacity:0.5;">HOLOGRAPHIC GUIDE v1.0</div>
            </div>
        `;

        card.innerHTML = `
            ${actionHtml}
            <h3>${stretch.title}</h3>
            <p>${stretch.description}</p>
            <div class="steps-text"><strong>Action:</strong> ${stretch.steps}</div>
        `;
        cardContainer.appendChild(card);
    });
}

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
    const intersects = raycaster.intersectObjects(clickTargets.children);

    clickTargets.children.forEach(child => child.material.opacity = 0);
    if (intersects.length > 0) {
        intersects[0].object.material.opacity = 0.3;
        canvasContainer.style.cursor = 'pointer';
    } else {
        canvasContainer.style.cursor = 'default';
    }
}

function onClick(event) {
    updateMouse(event);
    raycaster.setFromCamera(mouse, camera); 
    const intersects = raycaster.intersectObjects(clickTargets.children);

    if (intersects.length > 0) {
        const category = bodyPartMapping[intersects[0].object.name];
        displayStretches(category);
        intersects[0].object.material.opacity = 0.8;
        setTimeout(() => intersects[0].object.material.opacity = 0.3, 200);
    }
}

document.getElementById('show-all-btn').addEventListener('click', () => displayStretches('all'));
canvasContainer.addEventListener('mousemove', onMouseMove);
canvasContainer.addEventListener('click', onClick);

function animate(time) {
    requestAnimationFrame(animate);
    if (bodyGroup.children.length > 0) {
        bodyGroup.position.y = Math.sin(time * 0.002) * 0.15;
        clickTargets.position.y = bodyGroup.position.y;
    }
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
});

displayStretches();
animate(0);
