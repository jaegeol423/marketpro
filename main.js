/**
 * MARKET INSIGHT - Advanced Mega Dashboard Logic
 * 애플(AAPL)로 튕기는 현상을 방지하고 모든 심볼 가시성을 100% 확보합니다.
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initAllCharts();
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
 * 모든 차트 초기화 (심볼 인식률 극대화 버전)
 */
function initAllCharts() {
    const cards = document.querySelectorAll('.chart-card');
    cards.forEach(card => {
        const container = card.querySelector('.chart-container');
        const symbol = card.dataset.symbol;
        if (container && symbol) {
            renderAdvancedWidget(container.id, symbol);
        }
    });
}

/**
 * 애플로 튕기지 않도록 심볼을 강제 고정하는 위젯 렌더링
 */
function renderAdvancedWidget(containerId, symbol) {
    const colors = getPastelColors(containerId);
    
    // 이 설정은 지수(VIX, DXY) 및 개별 주식을 모두 아우르는 가장 안정적인 고급 위젯 방식입니다.
    new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": symbol,
        "interval": "D",
        "timezone": "Asia/Seoul",
        "theme": "dark",
        "style": "3", // Area Style
        "locale": "ko",
        "toolbar_bg": "#1a1f26",
        "enable_publishing": false,
        "hide_top_toolbar": true,
        "hide_legend": false,
        "save_image": false,
        "container_id": containerId,
        "backgroundColor": "#1a1f26",
        "gridColor": "rgba(255, 255, 255, 0.03)",
        "withdateranges": true,
        "hide_side_toolbar": true,
        "overrides": {
            "mainSeriesProperties.areaStyle.linecolor": colors.line,
            "mainSeriesProperties.areaStyle.color1": colors.top,
            "mainSeriesProperties.areaStyle.color2": "rgba(26, 31, 38, 0)",
            "mainSeriesProperties.areaStyle.linewidth": 3,
            "paneProperties.background": "#1a1f26",
            "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.02)",
            "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.02)",
            "scalesProperties.textColor": "#a0aec0",
            "legendProperties.showSeriesOHLC": true,
            "legendProperties.showSeriesTitle": true
        }
    });
}

function getPastelColors(id) {
    let line = "rgba(165, 180, 252, 1)"; 
    
    if (id.includes('kospi')) line = "rgba(165, 180, 252, 1)";      
    else if (id.includes('sp500')) line = "rgba(253, 164, 175, 1)"; 
    else if (id.includes('nasdaq')) line = "rgba(153, 246, 228, 1)"; 
    else if (id.includes('sox')) line = "rgba(190, 242, 100, 1)";    
    else if (id.includes('fx')) line = "rgba(190, 242, 100, 1)";     
    else if (id.includes('dxy')) line = "rgba(165, 180, 252, 1)";    
    else if (id.includes('yield')) line = "rgba(253, 164, 175, 1)";  
    else if (id.includes('vix')) line = "rgba(252, 165, 165, 1)";    
    else if (id.includes('gold')) line = "rgba(253, 224, 71, 1)";   
    else if (id.includes('silver')) line = "rgba(226, 232, 240, 1)";
    else if (id.includes('oil')) line = "rgba(251, 146, 60, 1)";    
    else if (id.includes('gas')) line = "rgba(56, 189, 248, 1)";
    else if (id.includes('nvda')) line = "rgba(153, 246, 228, 1)";
    else if (id.includes('tsla')) line = "rgba(252, 165, 165, 1)";
    else if (id.includes('btc')) line = "rgba(244, 114, 182, 1)";    
    else if (id.includes('eth')) line = "rgba(192, 132, 252, 1)";    

    return { line: line, top: line.replace('1)', '0.3)') };
}
