/* ==========================================
   状態管理とアプリケーション
   ========================================== */

// グローバル状態
const appState = {
    page: 'home',
    shopId: null,
    history: ['home'],
    currentSlideIndex: 0,
};

// DOM要素のキャッシュ
const dom = {
    content: document.getElementById('main-content'),
    breadcrumb: document.getElementById('breadcrumb'),
    menuToggle: document.getElementById('menu-toggle'),
    navButtons: document.querySelectorAll('.nav-button'),
    slideNavButtons: document.querySelectorAll('.slide-nav-button'),
    logo: document.querySelector('.logo'),
};

/* ==========================================
   ページテンプレート
   ========================================== */

// ホームページ
const homeTemplate = () => `
    <div class="home-container">
        <div class="home-intro">
            <h1>ようこそ</h1>
            <p>大潟ショッピングセンターでは、様々な店舗情報やイベント情報をご紹介しています。最新の情報をチェックして、あなたのお気に入りを見つけてください。</p>
        </div>
        
        <div class="slider-wrapper">
            <div class="slider">
                <div class="slider-track" id="slider-track-home">
                    <!-- スライドアイテムがここに挿入される -->
                </div>
                <button class="slider-button slider-button-prev" onclick="app.slidePrev()">
                    <span class="slider-arrow">‹</span>
                </button>
                <button class="slider-button slider-button-next" onclick="app.slideNext()">
                    <span class="slider-arrow">›</span>
                </button>
                <div class="slider-dots" id="slider-dots-home"></div>
            </div>
        </div>
    </div>
`;

// ショップリストページ
const shopsListTemplate = (shops) => `
    <h2>店舗一覧</h2>
    <div class="shops-grid">
        ${shops.map(shop => `
            <div class="shop-card">
                <div class="shop-card-image">${shop.icon || '🏪'}</div>
                <div class="shop-card-content">
                    <h3>${shop.name}</h3>
                    <p>${shop.description}</p>
                    <div class="shop-card-footer">
                        <button class="shop-button" onclick="app.goToShopDetail('${shop.id}')">
                            詳細を見る
                        </button>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
`;

// イベントページ
const eventsTemplate = () => `
    <div class="placeholder">
        <h2>イベント</h2>
        <p>準備中です。近日公開予定。</p>
    </div>
`;

// 地図ページ
const mapTemplate = () => `
    <h2>アクセス</h2>
    <div class="map-section">
        <div class="map-info">
            <h3>大潟ショッピングセンター</h3>
            <p><strong>住所：</strong>新潟県上越市大潟区土底浜1055-1</p>
            <p><strong>営業時間：</strong>10:00 - 21:00</p>
        </div>
        <div class="map-container">
            <iframe 
                width="100%" 
                height="500" 
                frameborder="0" 
                style="border:0; border-radius: 4px;" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3110.8934523457396!2d137.86897!3d37.19516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5ff57ad42f567c59%3A0x3a3b3b3b3b3b3b3b!2z5aSW6Zut5biC5rCR57Se57q_5bel5rCR5oql5pil!5e0!3m2!1sja!2sjp!4v1234567890"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        </div>
    </div>
`;

/* ==========================================
   データ（モックとして）
   ========================================== */

// スライド用データ（イベント・おすすめ商品・募集情報など）
const slidesData = [
    {
        id: 'slide-1',
        title: '現在開催中のイベント',
        subtitle: '春の大セール',
        image: 'slides/event-spring.jpg',
        description: '全店舗で春の大セールを開催中！最大50%OFFの商品も。',
        type: 'event',
    },
    {
        id: 'slide-2',
        title: 'サンプル店舗A',
        subtitle: 'おすすめメニュー',
        image: 'slides/shop-a-menu.jpg',
        description: '今月のおすすめ：春限定ブレンドコーヒー 新発売！',
        type: 'shop',
        shopId: 'shop-a',
    },
    {
        id: 'slide-3',
        title: 'サンプル店舗B',
        subtitle: 'イベント情報',
        image: 'slides/shop-b-event.jpg',
        description: '来月、シェフ直伝のパスタ教室を開催予定です。',
        type: 'shop',
        shopId: 'shop-b',
    },
    {
        id: 'slide-4',
        title: '出店者募集',
        subtitle: '大潟ショッピングセンター',
        image: 'slides/recruitment.jpg',
        description: '新しい店舗の出店者を募集しています。詳しくはお問い合わせください。',
        type: 'recruitment',
    },
];

const shopsData = [
    {
        id: 'shop-a',
        name: 'サンプル店舗 A',
        icon: '☕',
        description: 'こだわりのコーヒーと落ち着いた雰囲気が特徴の温かいカフェ。地元産の素材を使用したメニューが豊富。',
        address: '新潟県上越市大潟区土底浜1055-1',
        phone: '025-xxx-xxxx',
        hours: '平日 9:00-22:00 / 土日祝 8:00-23:00',
        detailDescription: `
            <p>
                私たちのカフェは、お客様が心からリラックスできる場所を目指して営業しています。
                すべてのコーヒー豆は、海外の厳選された農園から直接仕入れており、
                毎日新鮮な状態で提供させていただいております。
            </p>
            <h3>こだわり</h3>
            <p>
                使用する水にもこだわり、専門の浄水システムを導入しています。
                また、季節ごとに限定メニューも提供しており、
                リピーターの皆様にも新たな味わいを楽しんでいただけます。
            </p>
        `,
    },
    {
        id: 'shop-b',
        name: 'サンプル店舗 B',
        icon: '🍝',
        description: '本場イタリアンの味を再現した、職人が仕上げるパスタが自慢。素材にこだわる本格レストラン。',
        address: '新潟県上越市大潟区土底浜1055-1',
        phone: '025-xxx-xxxx',
        hours: '昼 11:30-14:00 / 夜 17:30-22:00（月曜定休）',
        detailDescription: `
            <p>
                創業20年のイタリアンレストランです。
                シェフは毎年イタリアに赴き、最新のトレンドと伝統的な調理法を学んでいます。
                使用する食材は すべてヨーロッパ産のものを厳選しており、
                真のイタリアンの味をお届けしています。
            </p>
            <h3>シグネチャーメニュー</h3>
            <p>
                当店の看板メニューは、フレッシュトマトを使用したパスタです。
                毎日仕込まれるパスタ生地と、昼間に調理したトマトソースの組み合わせは
                多くのお客様にご愛顧いただいております。
            </p>
        `,
    },
];

/* ==========================================
   ページ遷移・描画関数
   ========================================== */

const app = {
    // ページを描画
    render() {
        const { page, shopId } = appState;

        // パンくずリストの更新
        this.updateBreadcrumb();

        // ナビボタンのアクティブ状態を更新
        this.updateNavigation();

        // メインコンテンツの描画
        if (page === 'home') {
            dom.content.innerHTML = homeTemplate();
            // ホームの場合のみスライドを初期化
            setTimeout(() => this.initSlider(), 0);
        } else if (page === 'shops') {
            dom.content.innerHTML = shopsListTemplate(shopsData);
            this.stopSliderAutoPlay();
        } else if (page === 'shop-detail' && shopId) {
            const shop = shopsData.find(s => s.id === shopId);
            if (shop) {
                dom.content.innerHTML = this.renderShopDetail(shop);
            }
            this.stopSliderAutoPlay();
        } else if (page === 'events') {
            dom.content.innerHTML = eventsTemplate();
            this.stopSliderAutoPlay();
        } else if (page === 'map') {
            dom.content.innerHTML = mapTemplate();
            this.stopSliderAutoPlay();
        }

        // ページトップにスクロール
        window.scrollTo(0, 0);

        // メニューを閉じる
        dom.menuToggle.checked = false;
    },

    // 店舗詳細ページのテンプレート
    renderShopDetail(shop) {
        return `
            <div class="shop-detail">
                <div class="detail-header">
                    <div class="detail-image">${shop.icon}</div>
                    <h2>${shop.name}</h2>
                    <div class="detail-meta">
                        <div class="detail-meta-item">
                            <div class="detail-meta-label">住所</div>
                            <div class="detail-meta-value">${shop.address}</div>
                        </div>
                        <div class="detail-meta-item">
                            <div class="detail-meta-label">電話</div>
                            <div class="detail-meta-value">${shop.phone}</div>
                        </div>
                        <div class="detail-meta-item">
                            <div class="detail-meta-label">営業時間</div>
                            <div class="detail-meta-value">${shop.hours}</div>
                        </div>
                    </div>
                </div>
                <div class="detail-content">
                    ${shop.detailDescription}
                    <h3>ギャラリー</h3>
                    <div class="gallery">
                        <div class="gallery-item">写真1</div>
                        <div class="gallery-item">写真2</div>
                        <div class="gallery-item">写真3</div>
                        <div class="gallery-item">写真4</div>
                    </div>
                </div>
                <button class="back-button" onclick="app.goBack()">戻る</button>
            </div>
        `;
    },

    // パンくずリストの更新
    updateBreadcrumb() {
        const { page, shopId } = appState;
        let breadcrumbHTML = '<a href="#" class="breadcrumb-item" data-page="home">ホーム</a>';

        if (page === 'home') {
            breadcrumbHTML = '<span class="breadcrumb-item current">ホーム</span>';
        } else if (page === 'shops') {
            breadcrumbHTML += '<span class="breadcrumb-item current">店舗</span>';
        } else if (page === 'shop-detail' && shopId) {
            const shop = shopsData.find(s => s.id === shopId);
            breadcrumbHTML += `<a href="#" class="breadcrumb-item" data-page="shops">店舗</a>`;
            breadcrumbHTML += `<span class="breadcrumb-item current">${shop?.name || '詳細'}</span>`;
        } else if (page === 'events') {
            breadcrumbHTML += '<span class="breadcrumb-item current">イベント</span>';
        } else if (page === 'map') {
            breadcrumbHTML += '<span class="breadcrumb-item current">地図</span>';
        }

        dom.breadcrumb.innerHTML = breadcrumbHTML;

        // パンくずのイベントリスナーを再登録
        this.attachBreadcrumbListeners();
    },

    // ナビゲーション状態の更新
    updateNavigation() {
        const { page } = appState;
        const pageMap = {
            home: 'home',
            shops: 'shops',
            'shop-detail': 'shops',
            events: 'events',
            map: 'map',
        };

        const activePage = pageMap[page] || 'home';

        dom.navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === activePage);
        });
    },

    // ページ遷移
    goToPage(page) {
        appState.page = page;
        appState.shopId = null;
        appState.history.push(page);
        this.render();
    },

    // 店舗詳細ページへ遷移
    goToShopDetail(shopId) {
        appState.page = 'shop-detail';
        appState.shopId = shopId;
        appState.history.push(`shop-detail:${shopId}`);
        this.render();
    },

    // 戻る機能
    goBack() {
        if (appState.history.length > 1) {
            appState.history.pop();
            const lastState = appState.history[appState.history.length - 1];

            if (lastState.startsWith('shop-detail:')) {
                const shopId = lastState.split(':')[1];
                appState.page = 'shop-detail';
                appState.shopId = shopId;
            } else {
                appState.page = lastState;
                appState.shopId = null;
            }
        } else {
            appState.page = 'home';
            appState.shopId = null;
        }

        this.render();
    },

    // パンくずのイベントリスナー
    attachBreadcrumbListeners() {
        const breadcrumbItems = dom.breadcrumb.querySelectorAll('[data-page]');
        breadcrumbItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.goToPage(page);
            });
        });
    },

    /* ==========================================
       スライド管理
       ========================================== */

    // スライダーの初期化
    initSlider() {
        appState.currentSlideIndex = 0;
        this.renderSlider();
        this.startSliderAutoPlay();
    },

    // スライダーの描画
    renderSlider() {
        // ホームページ内のスライド要素を取得
        const sliderTrack = document.getElementById('slider-track-home');
        const sliderDots = document.getElementById('slider-dots-home');

        if (!sliderTrack || !sliderDots) return;

        const tracks = slidesData.map((slide, index) => `
            <div class="slider-item" data-index="${index}">
                <div class="slider-item-image">
                    <img src="${slide.image}" alt="${slide.title}" onerror="this.src='slides/placeholder.svg'">
                </div>
                <div class="slider-item-content">
                    <h3>${slide.title}</h3>
                    <p class="slider-item-subtitle">${slide.subtitle}</p>
                    <p class="slider-item-description">${slide.description}</p>
                    ${slide.type === 'shop' ? `<button class="slider-cta" onclick="app.goToShopDetail('${slide.shopId}')">詳細を見る</button>` : ''}
                </div>
            </div>
        `).join('');

        sliderTrack.innerHTML = tracks;

        // ドットの描画
        const dots = slidesData.map((_, index) => `
            <button class="slider-dot ${index === appState.currentSlideIndex ? 'active' : ''}" 
                    onclick="app.goToSlide(${index})"></button>
        `).join('');

        sliderDots.innerHTML = dots;

        // スライドの位置を更新
        this.updateSliderPosition();
    },

    // スライダーの位置を更新
    updateSliderPosition() {
        const sliderTrack = document.getElementById('slider-track-home');
        if (!sliderTrack) return;

        const offset = -appState.currentSlideIndex * 100;
        sliderTrack.style.transform = `translateX(${offset}%)`;
    },

    // スライド自動再生用タイマーID
    sliderAutoPlayTimer: null,

    // スライド自動再生開始
    startSliderAutoPlay() {
        // 既存のタイマーをクリア
        if (this.sliderAutoPlayTimer) {
            clearInterval(this.sliderAutoPlayTimer);
        }
        // 4秒ごとに次のスライドへ
        this.sliderAutoPlayTimer = setInterval(() => {
            this.slideNext();
        }, 4000);
    },

    // スライド自動再生停止
    stopSliderAutoPlay() {
        if (this.sliderAutoPlayTimer) {
            clearInterval(this.sliderAutoPlayTimer);
            this.sliderAutoPlayTimer = null;
        }
    },

    // スライドを移動
    goToSlide(index) {
        if (index >= 0 && index < slidesData.length) {
            appState.currentSlideIndex = index;
            this.renderSlider();
            // 自動再生をリセット
            this.startSliderAutoPlay();
        }
    },

    // 次のスライド
    slideNext() {
        const nextIndex = (appState.currentSlideIndex + 1) % slidesData.length;
        this.goToSlide(nextIndex);
    },

    // 前のスライド
    slidePrev() {
        const prevIndex = (appState.currentSlideIndex - 1 + slidesData.length) % slidesData.length;
        this.goToSlide(prevIndex);
    },
};

/* ==========================================
   イベントリスナー
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ナビゲーションボタン（モバイル時はハンバーガーボタンが非表示）
    dom.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            app.goToPage(page);
        });
    });

    // スライドメニューボタン
    dom.slideNavButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            app.goToPage(page);
        });
    });

    // ロゴクリック（ホームへ）
    dom.logo.addEventListener('click', () => {
        app.goToPage('home');
    });

    // 初期レンダリング
    app.render();
});

/* ==========================================
   グローバル関数（HTMLから呼び出し用）
   ========================================== */

// これらは onclick属性から呼び出される
window.goToShopDetail = (shopId) => app.goToShopDetail(shopId);
window.goBack = () => app.goBack();
window.goToSlide = (index) => app.goToSlide(index);
window.slideNext = () => app.slideNext();
window.slidePrev = () => app.slidePrev();
