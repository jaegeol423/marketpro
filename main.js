/**
 * KOSPI Market Dashboard - Logic & Charts (MZ Pastel Edition)
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
    const dot = document.querySelector('.status-dot');
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const isMarketOpen = checkMarketHours(now);
        const statusText = isMarketOpen ? 'MARKET OPEN' : 'MARKET CLOSED';
        
        timeDisplay.innerHTML = `${statusText} | ${hours}:${minutes}:${seconds}`;
        
        if (isMarketOpen) {
            dot.style.color = '#bef264'; // Mint/Lime
            dot.style.backgroundColor = '#bef264';
            dot.classList.add('pulse');
        } else {
            dot.style.color = '#fca5a5'; // Rose
            dot.style.backgroundColor = '#fca5a5';
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
 * 개별 차트 생성 함수 (파스텔 테마 적용)
 */
function createWidget(containerId, symbol, interval = "D") {
    document.getElementById(containerId).innerHTML = '';
    
    const colors = getPastelColors(containerId);
    
    return new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": symbol,
        "interval": interval,
        "timezone": "Asia/Seoul",
        "theme": "dark",
        "style": "3", // Area Chart
        "locale": "ko",
        "toolbar_bg": "#1a1f26",
        "enable_publishing": false,
        "hide_top_toolbar": true,
        "hide_legend": true,
        "save_image": false,
        "container_id": containerId,
        "lineColor": colors.line,
        "topColor": colors.top,
        "bottomColor": "rgba(26, 31, 38, 0)",
        "backgroundColor": "#1a1f26",
        "gridColor": "rgba(45, 55, 72, 0.2)"
    });
}

/**
 * MZ 파스텔 색상 추출
 */
function getPastelColors(id) {
    let line = "#a5b4fc"; // Default Lavender
    
    if (id.includes('kospi')) line = "#a5b4fc";      // Lavender Blue
    else if (id.includes('sp500')) line = "#fda4af"; // Soft Peach
    else if (id.includes('nasdaq')) line = "#99f6e4"; // Mint
    else if (id.includes('k200')) line = "#c084fc";   // Violet
    else if (id.includes('fx')) line = "#bef264";     // Lime
    else if (id.includes('yield')) line = "#fca5a5";  // Rose

    return {
        line: line,
        top: line + "33" // 20% 투명도
    };
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

            card.querySelectorAll('.int-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            createWidget(containerId, symbol, interval);
        });
    });
}
