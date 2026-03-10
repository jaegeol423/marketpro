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

// --- 스트레칭 전문 데이터 (해부학적 근거 보강) --------------------------------------
const stretches = [
    { 
        bodyPart: '목', 
        title: '경추 심부 굴곡근 강화 및 이완', 
        description: '장시간 모니터 사용으로 인해 단축된 사각근과 흉쇄유돌근을 이완하고, 경추 정렬을 바로잡아 거북목 증후군을 완화합니다.',
        steps: '1. 정면을 응시한 상태에서 턱을 몸쪽으로 수평하게 당깁니다(Chin-tuck). 2. 정수리가 천장 쪽으로 길어지는 느낌을 유지하며 10초간 머뭅니다. 3. 어깨가 따라 올라가지 않도록 주의하며 서서히 머리를 한쪽으로 기울여 측면 근육을 신장시킵니다.'
    },
    { 
        bodyPart: '어깨', 
        title: '회전근개 가동성 확보 및 대흉근 신전', 
        description: '말린 어깨(라운드 숄더)를 교정하기 위해 가슴 앞쪽 대흉근을 열어주고, 견갑골 주변 근육의 안정성을 높여 어깨 충돌 증후군을 예방합니다.',
        steps: '1. 벽 모서리에 양팔을 ㄴ자로 대고 섭니다. 2. 가슴을 전방으로 서서히 밀어내며 어깨 앞쪽이 시원하게 늘어나는 것을 느낍니다. 3. 양쪽 견갑골이 서로 만난다는 느낌으로 등 뒤 근육을 수축하며 20초간 유지합니다.'
    },
    { 
        bodyPart: '등', 
        title: '척추 기립근 및 요방형근 릴리즈', 
        description: '척추 마디마디의 공간을 확보하여 요추의 압박을 줄이고, 허리 통증의 주원인인 요방형근과 광배근을 이완하여 유연한 상체를 만듭니다.',
        steps: '1. 네발 기기 자세에서 숨을 내쉬며 꼬리뼈부터 등까지 둥글게 말아 천장으로 올립니다(고양이 자세). 2. 반대로 숨을 들이마시며 배꼽을 바닥 쪽으로 낮추고 시선은 먼 정면을 봅니다(소 자세). 3. 척추의 움직임을 세밀하게 느끼며 10회 반복합니다.'
    },
    { 
        bodyPart: '팔/손목', 
        title: '수근관 증후군 예방 및 전완근 이완', 
        description: '손목 터널 내 정중신경의 압박을 완화하고, 키보드와 마우스 사용으로 긴장된 전완 굴곡근을 스트레칭하여 통증을 케어합니다.',
        steps: '1. 한쪽 팔을 앞으로 쭉 뻗고 손바닥이 앞을 향하게 세웁니다. 2. 반대 손으로 손가락 끝을 몸쪽으로 지긋이 당깁니다. 3. 팔꿈치가 굽혀지지 않도록 주의하며 전완 안쪽이 늘어나는 것을 15초간 느낍니다.'
    },
    { 
        bodyPart: '다리', 
        title: '좌골신경통 완화 및 이상근/햄스트링 이완', 
        description: '골반 깊숙한 곳의 이상근을 이완하여 신경 압박을 해소하고, 짧아진 햄스트링을 늘려 하체 부종 예방 및 골반 불균형을 교정합니다.',
        steps: '1. 바닥에 누워 한쪽 다리를 반대편 무릎 위에 숫자 4 모양으로 올립니다. 2. 아래쪽 허벅지를 양손으로 감싸 가슴 쪽으로 천천히 당깁니다. 3. 엉덩이 깊은 곳의 자극을 느끼며 호흡과 함께 20초간 유지합니다.'
    },
];


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
