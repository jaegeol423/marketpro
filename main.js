/**
 * MARKET INSIGHT PRO - Final Multi-Page Portfolio Logic
 */

let starredAssets = JSON.parse(localStorage.getItem('starredAssets')) || [];
let currentTheme = localStorage.getItem('theme') || 'pastel-dark';
let isSidebarOpen = localStorage.getItem('sidebarOpen') !== 'false';

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initTheme();
    initSidebar();
    initKoreanNewsWidget();
    
    // 현재 페이지가 인덱스(대시보드)일 때만 차트 초기화
    if (document.getElementById('dashboard')) {
        initAllCharts();
        setupIntervalControls();
        setupWatchlistControls();
    }
    
    initDisqus();
});

function initTheme() {
    updateBodyClass();
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'pastel-dark' ? 'pure-dark' : 'pastel-dark';
            updateBodyClass();
            localStorage.setItem('theme', currentTheme);
            if (document.getElementById('dashboard')) initAllCharts();
        });
    }
}

function updateBodyClass() {
    document.body.className = `${currentTheme} ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`;
}

function initSidebar() {
    const toggleBtn = document.getElementById('news-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isSidebarOpen = !isSidebarOpen;
            updateBodyClass();
            localStorage.setItem('sidebarOpen', isSidebarOpen);
            setTimeout(() => window.dispatchEvent(new Event('resize')), 400);
        });
    }
}

function renderAdvancedPro(containerId, symbol, interval = "D") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ''; 

    const colors = getPastelColors(containerId);
    const themeValue = currentTheme === 'pure-dark' ? '#000000' : '#1a1f26';
    
    new TradingView.widget({
        "width": "100%",
        "height": "100%",
        "symbol": symbol,
        "interval": interval,
        "timezone": "Asia/Seoul",
        "theme": "dark",
        "style": "3", 
        "locale": "ko",
        "toolbar_bg": themeValue,
        "enable_publishing": false,
        "hide_top_toolbar": true, 
        "hide_legend": false, 
        "save_image": true,
        "container_id": containerId,
        "backgroundColor": themeValue,
        "gridColor": "rgba(255, 255, 255, 0.02)",
        "range": interval === "D" ? "3M" : interval === "M" ? "12M" : "1D",
        "overrides": {
            "mainSeriesProperties.areaStyle.linecolor": colors.line,
            "mainSeriesProperties.areaStyle.color1": colors.top,
            "mainSeriesProperties.areaStyle.color2": "rgba(0, 0, 0, 0)",
            "mainSeriesProperties.areaStyle.linewidth": 3,
            "paneProperties.background": themeValue,
            "scalesProperties.textColor": "#a0aec0",
            "legendProperties.showSeriesOHLC": true,
            "legendProperties.showBarChange": true
        }
    });
}

function getPastelColors(id) {
    let line = "rgba(165, 180, 252, 1)"; 
    if (id.includes('kospi')) line = "rgba(165, 180, 252, 1)";      
    else if (id.includes('sp500')) line = "rgba(253, 164, 175, 1)"; 
    else if (id.includes('nasdaq')) line = "rgba(153, 246, 228, 1)"; 
    else if (id.includes('sox')) line = "rgba(190, 242, 100, 1)";    
    else if (id.includes('gold')) line = "rgba(253, 224, 71, 1)";   
    else if (id.includes('silver')) line = "rgba(226, 232, 240, 1)";
    else if (id.includes('btc')) line = "rgba(244, 114, 182, 1)";    
    else if (id.includes('eth')) line = "rgba(192, 132, 252, 1)";    
    else if (id.includes('nvda')) line = "rgba(153, 246, 228, 1)";
    else if (id.includes('fx')) line = "rgba(190, 242, 100, 1)";
    return { line: line, top: line.replace('1)', '0.2)') };
}

function initAllCharts() {
    document.querySelectorAll('.chart-card').forEach(card => {
        const container = card.querySelector('.chart-container');
        if (container) renderAdvancedPro(container.id, card.dataset.symbol, "D");
    });
}

function setupIntervalControls() {
    document.querySelectorAll('.int-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.chart-card');
            const interval = e.target.dataset.int;
            card.querySelectorAll('.int-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderAdvancedPro(card.querySelector('.chart-container').id, card.dataset.symbol, interval);
        });
    });
}

function initClock() {
    const timeDisplay = document.getElementById('market-time');
    if (timeDisplay) {
        setInterval(() => {
            timeDisplay.innerHTML = new Date().toLocaleTimeString('ko-KR');
        }, 1000);
    }
}

function initKoreanNewsWidget() {
    const container = document.getElementById('tradingview-news');
    if (!container) return;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
        "feedMode": "all_symbols", "colorTheme": "dark", "isTransparent": true,
        "displayMode": "regular", "width": "100%", "height": "100%", "locale": "ko"
    });
    container.appendChild(script);
}

function setupWatchlistControls() {
    const favBtns = document.querySelectorAll('.fav-btn');
    const watchlistSection = document.getElementById('watchlist-section');
    function updateUI() {
        let count = 0;
        document.querySelectorAll('.chart-card').forEach(card => {
            const btn = card.querySelector('.fav-btn');
            if (starredAssets.includes(card.dataset.id)) { btn.classList.add('active'); count++; }
            else { btn.classList.remove('active'); }
        });
        if(watchlistSection) watchlistSection.classList.toggle('hidden', count === 0);
    }
    favBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.chart-card').dataset.id;
            starredAssets = starredAssets.includes(id) ? starredAssets.filter(i => i!==id) : [...starredAssets, id];
            localStorage.setItem('starredAssets', JSON.stringify(starredAssets));
            updateUI();
        });
    });
    updateUI();
}

function initDisqus() {
    const thread = document.getElementById('disqus_thread');
    if (!thread) return;
    var d = document, s = d.createElement('script');
    s.src = 'https://test-vmewaufzig.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
}
