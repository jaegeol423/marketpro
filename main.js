/**
 * KOSPI Market Dashboard - Logic & Charts
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initCharts();
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
 * TradingView 차트 초기화
 */
function initCharts() {
    const commonSettings = {
        "width": "100%",
        "height": "100%",
        "interval": "D",
        "timezone": "Asia/Seoul",
        "theme": "dark",
        "style": "3", // Area Chart
        "locale": "ko",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_top_toolbar": true,
        "hide_legend": true,
        "save_image": false,
        "container_id": ""
    };

    // 1. KOSPI (EWY ETF)
    new TradingView.widget({
        ...commonSettings,
        "symbol": "AMEX:EWY",
        "container_id": "chart_kospi",
        "lineColor": "#2962FF",
        "topColor": "rgba(41, 98, 255, 0.3)"
    });

    // 2. S&P 500 (SPY ETF)
    new TradingView.widget({
        ...commonSettings,
        "symbol": "AMEX:SPY",
        "container_id": "chart_sp500",
        "lineColor": "#FF9800",
        "topColor": "rgba(255, 152, 0, 0.3)"
    });

    // 3. NASDAQ 100 (QQQ ETF)
    new TradingView.widget({
        ...commonSettings,
        "symbol": "NASDAQ:QQQ",
        "container_id": "chart_nasdaq",
        "lineColor": "#00BCD4",
        "topColor": "rgba(0, 188, 212, 0.3)"
    });

    // 4. KOSPI 200
    new TradingView.widget({
        ...commonSettings,
        "symbol": "KRX:KOSPI200",
        "container_id": "chart_k200",
        "lineColor": "#9C27B0",
        "topColor": "rgba(156, 39, 176, 0.3)"
    });

    // 5. USD/KRW
    new TradingView.widget({
        ...commonSettings,
        "symbol": "FX_IDC:USDKRW",
        "container_id": "chart_fx",
        "lineColor": "#4CAF50",
        "topColor": "rgba(76, 175, 80, 0.3)"
    });

    // 6. US 10Y Yield
    new TradingView.widget({
        ...commonSettings,
        "symbol": "TVC:US10Y",
        "container_id": "chart_yield",
        "lineColor": "#F44336",
        "topColor": "rgba(244, 67, 54, 0.3)"
    });
}
