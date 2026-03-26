/* ==========================================
   1. 状態管理
   ========================================== */
const appState = {
    page: 'home',
    shopId: null,
    currentSlideIndex: 0,
    shopsData: [],
    slidesData: [], 
    autoPlayTimer: null
};

// 要素の取得（再レンダリングで中身が消える main-content 以外を定義）
const dom = {
    getContent: () => document.getElementById('main-content'),
    getBreadcrumb: () => document.getElementById('breadcrumb'),
    getMenuToggle: () => document.getElementById('menu-toggle'),
};

/* ==========================================
   2. テンプレート
   ========================================== */

const homeTemplate = () => `
    <div class="home-container">
        <div class="slider-wrapper">
            <div class="slider">
                <div class="slider-track" id="slider-track-home"></div>
                <button class="slider-button slider-button-prev" onclick="app.slidePrev()">‹</button>
                <button class="slider-button slider-button-next" onclick="app.slideNext()">›</button>
                <div class="slider-dots" id="slider-dots"></div>
            </div>
        </div>
    </div>
`;

const shopsTemplate = () => `
    <div class="shops-container">
        <div class="home-intro"><h1>店舗一覧</h1></div>
        <div class="shops-grid">
            ${appState.shopsData.map(shop => `
                <div class="shop-card">
                    <div class="shop-card-image">${shop.image}</div>
                    <div class="shop-card-content">
                        <h3>${shop.name}</h3>
                        <p>${shop.category}</p>
                        <button class="shop-button" onclick="goToShopDetail('${shop.id}')">詳細を見る</button>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
`;

const shopDetailTemplate = (shopId) => {
    const shop = appState.shopsData.find(s => s.id === shopId);
    if (!shop) return '<p>店舗が見つかりませんでした。</p>';
    return `
        <div class="shop-detail">
            <div class="detail-image">${shop.image}</div>
            <h1>${shop.name}</h1>
            <div class="detail-meta">
                <p><strong>営業時間:</strong> ${shop.hours}</p>
                <p><strong>電話番号:</strong> ${shop.tel}</p>
                <p><strong>場所:</strong> ${shop.address}</p>
            </div>
            <div class="detail-description"><p>${shop.description}</p></div>
            <button class="back-button" onclick="app.goToPage('shops')">← 店舗一覧に戻る</button>
        </div>
    `;
};

const mapTemplate = () => `
    <div class="map-section">
        <div class="map-container">
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3176.8057380247756!2d138.32836937565523!3d37.228586272128176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff5d120ae93f517%3A0x45658d62fe65ae95!2z44CSOTQ5LTMxMTIg5paw5r2f55yM5LiK6LaK5biC5aSn5r2f5Yy65Zyf5bqV5rWc77yR77yQ77yV77yV4oiS77yR!5e0!3m2!1sja!2sjp!4v1774381298286!5m2!1sja!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
    </div>
`;

/* ==========================================
   3. アプリケーション本体
   ========================================== */
const app = {
    async init() {
        await this.loadAllData();
        this.setupEventListeners();
        this.render();
    },

    async loadAllData() {
        try {
            const [shopsRes, slidesRes] = await Promise.all([
                fetch('shops.json'),
                fetch('slides.json')
            ]);
            appState.shopsData = await shopsRes.json();
            const slides = await slidesRes.json();
            appState.slidesData = slides.sort((a, b) => a.priority - b.priority);
        } catch (error) {
            console.error('Data load error:', error);
        }
    },

    render() {
        const content = dom.getContent();
        if (!content) return;

        if (appState.page === 'home') content.innerHTML = homeTemplate();
        else if (appState.page === 'shops') content.innerHTML = shopsTemplate();
        else if (appState.page === 'shop-detail') content.innerHTML = shopDetailTemplate(appState.shopId);
        else if (appState.page === 'map') content.innerHTML = mapTemplate();

        this.updateBreadcrumb();
        this.updateActiveNav();
        
        if (appState.page === 'home') this.initSlider();
        else this.stopSliderAutoPlay();

        const toggle = dom.getMenuToggle();
        if (toggle) toggle.checked = false;
    },

    goToPage(page, id = null) {
        appState.page = page;
        appState.shopId = id;
        this.render();
        window.scrollTo(0, 0);
    },

    updateBreadcrumb() {
        const breadcrumb = dom.getBreadcrumb();
        if (!breadcrumb) return;

        let html = `<a href="#" class="breadcrumb-item" onclick="app.goToPage('home'); return false;">ホーム</a>`;
        if (appState.page === 'shops') {
            html += `<span class="breadcrumb-item">店舗一覧</span>`;
        } else if (appState.page === 'shop-detail') {
            const shop = appState.shopsData.find(s => s.id === appState.shopId);
            html += `<a href="#" class="breadcrumb-item" onclick="app.goToPage('shops'); return false;">店舗一覧</a>`;
            html += `<span class="breadcrumb-item">${shop ? shop.name : '詳細'}</span>`;
        }
        breadcrumb.innerHTML = html;
    },

    updateActiveNav() {
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === appState.page);
        });
    },

initSlider() {
        const track = document.getElementById('slider-track-home');
        if (!track || !appState.slidesData.length) return;

        track.innerHTML = appState.slidesData.map(slide => `
            <div class="slider-item ${slide.fullImage ? 'full-image-mode' : ''}">
                <div class="slider-item-image">
                    <img src="${slide.image}" alt="${slide.title}">
                </div>
                <div class="slider-item-content">
                    <h3>${slide.title}</h3>
                    <p>${slide.description || ''}</p>
                </div>
            </div>
        `).join('');

        const dots = document.getElementById('slider-dots');
        if (dots) {
            dots.innerHTML = appState.slidesData.map((_, i) => `
                <button class="slider-dot" onclick="app.goToSlide(${i})"></button>
            `).join('');
        }
        this.goToSlide(0);
        this.startSliderAutoPlay();
    },

    goToSlide(index) {
        const track = document.getElementById('slider-track-home');
        if (!track) return;
        appState.currentSlideIndex = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll('.slider-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    },

    slideNext() {
        const next = (appState.currentSlideIndex + 1) % appState.slidesData.length;
        this.goToSlide(next);
    },

    slidePrev() {
        const prev = (appState.currentSlideIndex - 1 + appState.slidesData.length) % appState.slidesData.length;
        this.goToSlide(prev);
    },

    startSliderAutoPlay() {
        this.stopSliderAutoPlay();
        if (appState.slidesData.length > 1) {
            appState.autoPlayTimer = setInterval(() => this.slideNext(), 5000);
        }
    },

    stopSliderAutoPlay() {
        if (appState.autoPlayTimer) clearInterval(appState.autoPlayTimer);
    },

setupEventListeners() {
        // 個別のボタンに登録するのではなく、画面全体（document）でクリックを監視します
        document.addEventListener('click', (e) => {
            const target = e.target;

            // 1. ナビゲーションボタンまたはスライドメニューボタンが押された場合
            const navBtn = target.closest('.nav-button, .slide-nav-button');
            if (navBtn) {
                const page = navBtn.dataset.page;
                this.goToPage(page);
                return; // 処理を終了
            }

            // 2. ロゴまたはロゴテキストが押された場合
            const logo = target.closest('.logo');
            if (logo) {
                this.goToPage('home');
                return;
            }

            // 3. 「詳細を見る」などの動的に追加されたボタンの場合
            // ※HTML側の onclick="..." を使わない、より安全な方法への準備です
            const shopBtn = target.closest('.shop-button');
            if (shopBtn) {
                // shop-detailへ遷移する処理
                // すでにonclickがある場合はそのままでも動きますが、
                // 効かない場合はここでも制御できるようにします。
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());
window.goToShopDetail = (id) => app.goToPage('shop-detail', id);