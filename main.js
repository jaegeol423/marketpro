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
            dot.style.backgroundColor = '#bef264';
            dot.classList.add('pulse');
        } else {
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
 * 차트 생성 함수 (스크립트 주입 방식)
 * 이 방식이 색상 변경과 가시성에 가장 확실합니다.
 */
function renderChart(containerId, symbol, interval = "D") {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // 기존 차트 제거

    const colors = getPastelColors(containerId);
    
    // TradingView 위젯 설정 생성
    const config = {
        "symbol": symbol,
        "width": "100%",
        "height": "100%",
        "locale": "ko",
        "dateRange": interval === "D" ? "1M" : interval === "W" ? "12M" : "1D",
        "colorTheme": "dark",
        "trendLineColor": colors.line,
        "underLineColor": colors.top,
        "underLineBottomColor": "rgba(26, 31, 38, 0)",
        "isTransparent": true,
        "autosize": true,
        "largeChartUrl": ""
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    
    container.appendChild(script);
}

function getPastelColors(id) {
    let line = "#a5b4fc"; 
    if (id.includes('kospi')) line = "#a5b4fc";      // Lavender Blue
    else if (id.includes('sp500')) line = "#fda4af"; // Soft Peach
    else if (id.includes('nasdaq')) line = "#99f6e4"; // Mint
    else if (id.includes('k200')) line = "#c084fc";   // Violet
    else if (id.includes('fx')) line = "#bef264";     // Lime
    else if (id.includes('yield')) line = "#fca5a5";  // Rose

    return {
        line: line,
        top: line + "33" // 20% Alpha
    };
}

function initCharts() {
    const cards = document.querySelectorAll('.chart-card');
    cards.forEach(card => {
        const containerId = card.querySelector('.chart-container').id;
        const symbol = card.dataset.symbol;
        renderChart(containerId, symbol, "D");
    });
}

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

            renderChart(containerId, symbol, interval);
        });
    });
}
