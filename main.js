/**
 * KOSPI Market Dashboard - Logic & Charts
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCharts();
    setupIntervalControls();
});

/**
 * 실시간 시계 업데이트
 */
function initClock() {
    const timeDisplay = document.getElementById('market-time');
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const isMarketOpen = checkMarketHours(now);
        const statusText = isMarketOpen ? 'MARKET OPEN' : 'MARKET CLOSED';
        timeDisplay.innerHTML = `${statusText} | ${hours}:${minutes}:${seconds}`;
        const dot = document.querySelector('.status-dot');
        if (isMarketOpen) {
            dot.style.backgroundColor = '#3fb950';
            dot.classList.add('pulse');
        } else {
            dot.style.backgroundColor = '#f85149';
            dot.classList.remove('pulse');
        }
    }
    setInterval(updateClock, 1000);
    updateClock();
}

function checkMarketHours(date) {
    const day = date.getDay();
    const timeValue = date.getHours() * 100 + date.getMinutes();
    if (day === 0 || day === 6) return false;
    return timeValue >= 900 && timeValue <= 1530;
}

/**
 * 개별 차트 생성 함수
 */
function createWidget(containerId, symbol, interval = "D") {
    // 기존 차트 내용 삭제 (새로 그리기 위해)
    document.getElementById(containerId).innerHTML = '';
    
    return new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": symbol,
        "interval": interval,
        "timezone": "Asia/Seoul",
        "theme": "dark",
        "style": "3", // Area Chart
        "locale": "ko",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_top_toolbar": true,
        "hide_legend": true,
        "save_image": false,
        "container_id": containerId,
        "lineColor": getLineColor(containerId),
        "topColor": getTopColor(containerId)
    });
}

function getLineColor(id) {
    if (id.includes('kospi')) return "#2962FF";
    if (id.includes('sp500')) return "#FF9800";
    if (id.includes('nasdaq')) return "#00BCD4";
    if (id.includes('k200')) return "#9C27B0";
    if (id.includes('fx')) return "#4CAF50";
    return "#F44336";
}

function getTopColor(id) {
    const hex = getLineColor(id);
    return hex + "4D"; // 30% alpha
}

/**
 * 초기 차트 로드
 */
function initCharts() {
    const cards = document.querySelectorAll('.chart-card');
    cards.forEach(card => {
        const containerId = card.querySelector('.chart-container').id;
        const symbol = card.dataset.symbol;
        createWidget(containerId, symbol, "D");
    });
}

/**
 * 주기 컨트롤 설정
 */
function setupIntervalControls() {
    const buttons = document.querySelectorAll('.int-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.chart-card');
            const containerId = card.querySelector('.chart-container').id;
            const symbol = card.dataset.symbol;
            const interval = e.target.dataset.int;

            // 버튼 상태 업데이트
            card.querySelectorAll('.int-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // 차트 업데이트
            createWidget(containerId, symbol, interval);
        });
    });
}
