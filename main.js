const lottoDisplay = document.getElementById('lotto-display');
const generateBtn = document.getElementById('generate-btn');
const historyContainer = document.getElementById('history-container');
const birthInput = document.getElementById('birthdate');
const sajuResult = document.getElementById('saju-result');
const statAnalysisToggle = document.getElementById('stat-analysis-toggle');
const analysisResult = document.getElementById('analysis-result');

// --- 가상 로또 번호 빈도 데이터 (통계 분석용) --------------------------------------
// 실제 통계와 유사한 가상 데이터를 생성합니다. (값이 낮을수록 최근에 안 나온 번호)
const historicalFrequency = {};
for (let i = 1; i <= 45; i++) {
    historicalFrequency[i] = Math.floor(Math.random() * 150) + 100; // 100~250회 사이 빈도
}

// --- 사주 데이터 -------------------------------------------------------------
const elements = {
    wood: { name: '목(木)', color: '초록', range: [1, 10, 41, 45], desc: '성장과 활력을 상징하는 목의 기운이 강합니다. 낮은 번호와 끝 번호가 행운을 가져다줄 것입니다.' },
    fire: { name: '화(火)', color: '빨강', range: [21, 30], desc: '열정과 에너지를 상징하는 화의 기운이 가득합니다. 20번대 중반 번호들에 주목하세요.' },
    earth: { name: '토(土)', color: '노랑/회색', range: [1, 5, 31, 40], desc: '안정과 신뢰를 상징하는 토의 기운이 깃들어 있습니다. 30번대 번호들이 길운을 보충해줍니다.' },
    metal: { name: '금(金)', color: '흰색/금색', range: [41, 45, 11, 20], desc: '결단력과 명예를 상징하는 금의 기운이 느껴집니다. 10번대와 최고령 번호들이 유리합니다.' },
    water: { name: '수(水)', color: '파랑', range: [11, 20], desc: '지혜와 흐름을 상징하는 수의 기운이 흐릅니다. 10번대 파란 공들이 당신의 행운 번호입니다.' }
};

function analyzeSaju(birthdate) {
    if (!birthdate) return null;
    const date = new Date(birthdate);
    const sum = date.getFullYear() + (date.getMonth() + 1) + date.getDate();
    const elementKeys = Object.keys(elements);
    const key = elementKeys[sum % elementKeys.length];
    return elements[key];
}

// --- 대수의 법칙 기반 Key 번호 선정 (가장 안 나온 번호 TOP 3) -------------------------
function getKeyNumbers() {
    return Object.entries(historicalFrequency)
        .sort(([, a], [, b]) => a - b) // 빈도가 낮은 순서로 정렬
        .slice(0, 3)
        .map(([num]) => parseInt(num));
}

// --- 가중치 랜덤 선택 알고리즘 --------------------------------------------------
function getWeightedRandomNumber(exclude, saju, useStat) {
    const weights = [];
    const keyNumbers = getKeyNumbers();

    for (let i = 1; i <= 45; i++) {
        if (exclude.includes(i)) continue;

        let weight = 10; // 기본 가중치

        // 1. 사주 가중치 (+15)
        if (saju && saju.range.includes(i)) weight += 15;

        // 2. 대수의 법칙 가중치 (안 나올수록 가중치 UP)
        if (useStat) {
            // 빈도의 역수에 비례하여 가중치 부여
            const freqWeight = Math.floor((300 - historicalFrequency[i]) / 10);
            weight += freqWeight;
            
            // TOP 3 미출현 번호(Key)는 추가 가중치 (+20)
            if (keyNumbers.includes(i)) weight += 20;
        }

        weights.push({ num: i, weight: weight });
    }

    const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of weights) {
        if (random < item.weight) return item.num;
        random -= item.weight;
    }
    return weights[weights.length - 1].num;
}

function generateLottoNumbers(saju, useStat) {
    const numbers = [];
    while (numbers.length < 6) {
        const num = getWeightedRandomNumber(numbers, saju, useStat);
        numbers.push(num);
    }
    return numbers.sort((a, b) => a - b);
}

// --- UI 헬퍼 ----------------------------------------------------------------
function getRangeClass(num) {
    if (num <= 10) return 'range-1';
    if (num <= 20) return 'range-2';
    if (num <= 30) return 'range-3';
    if (num <= 40) return 'range-4';
    return 'range-5';
}

function createBallElement(num, isSmall = false, isKey = false) {
    const ball = document.createElement('div');
    ball.className = `ball ${getRangeClass(num)} ${isSmall ? 'small-ball' : ''} ${isKey ? 'key-number' : ''}`;
    ball.textContent = num;
    return ball;
}

// --- 번호 추첨 실행 ----------------------------------------------------------
async function drawNumbers() {
    const birthdate = birthInput.value;
    const saju = analyzeSaju(birthdate);
    const useStat = statAnalysisToggle.checked;
    const keyNumbers = getKeyNumbers();

    generateBtn.disabled = true;
    lottoDisplay.innerHTML = '';
    
    // 결과창 초기화
    sajuResult.style.display = saju ? 'block' : 'none';
    if (saju) {
        sajuResult.innerHTML = `
            <p class="saju-title">✨ 사주 분석: ${saju.name}의 기운</p>
            <p class="saju-desc">${saju.desc}</p>
        `;
    }

    analysisResult.style.display = useStat ? 'block' : 'none';
    if (useStat) {
        analysisResult.innerHTML = `
            <p class="analysis-title">📊 대수의 법칙: 이번 회차 Key 번호</p>
            <p class="analysis-desc">최근 출현 빈도가 낮은 <strong>${keyNumbers.join(', ')}</strong>번에 높은 가중치가 부여되었습니다.</p>
        `;
    }
    
    const allGames = [];
    for (let g = 0; g < 5; g++) {
        const row = document.createElement('div');
        row.className = 'lotto-row';
        lottoDisplay.appendChild(row);
        
        const luckyNumbers = generateLottoNumbers(saju, useStat);
        allGames.push(luckyNumbers);
        
        for (let i = 0; i < luckyNumbers.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            const isKey = useStat && keyNumbers.includes(luckyNumbers[i]);
            const ball = createBallElement(luckyNumbers[i], false, isKey);
            row.appendChild(ball);
        }
        await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    saveToHistory(allGames, (saju ? saju.name : '') + (useStat ? ' + 통계' : ''));
    generateBtn.disabled = false;
}

function saveToHistory(allGames, type) {
    const history = JSON.parse(localStorage.getItem('lottoHistory') || '[]');
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}.${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    history.unshift({ date: dateStr, games: allGames, type: type || '일반' });
    localStorage.setItem('lottoHistory', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    if (!historyContainer) return;
    const history = JSON.parse(localStorage.getItem('lottoHistory') || '[]');
    historyContainer.innerHTML = history.length ? '' : '<p style="color: #444;">최근 내역이 없습니다.</p>';
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.style.flexDirection = 'column';
        historyItem.style.alignItems = 'flex-start';
        
        historyItem.innerHTML = `
            <div style="width: 100%; display: flex; justify-content: space-between; margin-bottom: 10px;">
                <div class="history-date">${item.date}</div>
                <div style="font-size: 0.75rem; color: var(--primary-color-start);">[${item.type}]</div>
            </div>
            <div class="games-list" style="display: flex; flex-direction: column; gap: 8px; width: 100%;"></div>
        `;

        const gamesList = historyItem.querySelector('.games-list');
        item.games.forEach(numbers => {
            const ballsDiv = document.createElement('div');
            ballsDiv.className = 'history-balls';
            numbers.forEach(num => ballsDiv.appendChild(createBallElement(num, true)));
            gamesList.appendChild(ballsDiv);
        });
        historyContainer.appendChild(historyItem);
    });
}

generateBtn.addEventListener('click', drawNumbers);
document.addEventListener('DOMContentLoaded', renderHistory);