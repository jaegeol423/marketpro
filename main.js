/**
 * MARKET INSIGHT - Professional MZ Pastel Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCharts();
    setupIntervalControls();
});

function initClock() {
    const timeDisplay = document.getElementById('market-time');
    const dot = document.querySelector('.status-dot');
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeDisplay.innerHTML = `${hours}:${minutes}:${seconds}`;
        const isMarketOpen = checkMarketHours(now);
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
 * 전역 차트 생성 함수 (Advanced Widget 활용)
 */
function createWidget(containerId, symbol, interval = "D") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ''; 

    const colors = getPastelColors(containerId);
    
    // TradingView Advanced Widget 설정
    return new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": symbol,
        "interval": interval,
        "timezone": "Asia/Seoul",
        "theme": "dark",
        "style": "3", // Area Style
        "locale": "ko",
        "toolbar_bg": "#1a1f26",
        "enable_publishing": false,
        "hide_top_toolbar": true,
        "hide_legend": true,
        "save_image": false,
        "container_id": containerId,
        "backgroundColor": "#1a1f26",
        "gridColor": "rgba(45, 55, 72, 0.05)",
        // 그래프 내부 색상을 파스텔로 강제 적용
        "overrides": {
            "mainSeriesProperties.style": 3, // Area
            "mainSeriesProperties.areaStyle.linecolor": colors.line,
            "mainSeriesProperties.areaStyle.color1": colors.top,
            "mainSeriesProperties.areaStyle.color2": "rgba(26, 31, 38, 0)",
            "mainSeriesProperties.areaStyle.linewidth": 3,
            "paneProperties.background": "#1a1f26",
            "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.02)",
            "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.02)",
            "scalesProperties.textColor": "#a0aec0",
            "scalesProperties.fontSize": 11
        }
    });
}

function getPastelColors(id) {
    let line = "#a5b4fc"; 
    
    // MZ Pastel Color Matching
    if (id.includes('kospi')) line = "#a5b4fc";      // Lavender
    else if (id.includes('sp500')) line = "#fda4af"; // Peach
    else if (id.includes('nasdaq')) line = "#99f6e4"; // Mint
    else if (id.includes('sox')) line = "#bef264";    // Lime
    else if (id.includes('samsung')) line = "#a5b4fc"; // Samsung Blue
    else if (id.includes('k200')) line = "#c084fc";   // Violet
    
    else if (id.includes('fx')) line = "#bef264";     // Lime
    else if (id.includes('dxy')) line = "#a5b4fc";    // Blue
    else if (id.includes('yield')) line = "#fda4af";  // Peach
    else if (id.includes('vix')) line = "#fca5a5";    // Rose
    
    else if (id.includes('gold')) line = "#fde047";   // Gold
    else if (id.includes('oil')) line = "#fb923c";    // Orange
    else if (id.includes('btc')) line = "#f472b6";    // Pink
    else if (id.includes('eth')) line = "#c084fc";    // Purple

    return {
        line: line,
        top: line + "4D" // 30% Alpha
    };
}

function initCharts() {
    const cards = document.querySelectorAll('.chart-card');
    cards.forEach(card => {
        const containerId = card.querySelector('.chart-container').id;
        const symbol = card.dataset.symbol;
        const interval = card.querySelector('.int-btn.active')?.dataset.int || "D";
        createWidget(containerId, symbol, interval);
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

            createWidget(containerId, symbol, interval);
        });
    });
}
