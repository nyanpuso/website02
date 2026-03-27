import { navigation } from './navigation.js';
import { slider } from './slider.js';
import { appState } from './state.js';

/**
 * データのロードと画像パスの自動補完
 */
async function loadAllData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();

        // 現在のドメインを取得 (例: http://localhost:8000 や https://your-site.com)
        const rootUrl = window.location.origin;

        // --- 画像パスの自動補完ロジック ---
        // スライドデータの変換
        appState.slidesData = (data.slides || []).map((slide: any) => ({
            ...slide,
            // httpから始まらない相対パスの場合のみ、rootUrlを付与
            image: slide.image.startsWith('http') 
                   ? slide.image 
                   : `${rootUrl}/${slide.image.replace(/^\//, '')}`
        }));

        // 店舗データの変換
        appState.shopsData = (data.shops || []).map((shop: any) => ({
            ...shop,
            image: shop.image && !shop.image.startsWith('http')
                   ? `${rootUrl}/${shop.image.replace(/^\//, '')}`
                   : shop.image
        }));

        console.log("1. データロード＆パス補完完了:", appState.slidesData);
    } catch (error) {
        console.error("データの読み込みに失敗しました:", error);
        appState.slidesData = [];
        appState.shopsData = [];
    }
}

/**
 * メインの初期化
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log("2. DOMContentLoaded: 開始");

    // データのロードを待ってから描画を開始する
    await loadAllData();

    // 初期描画
    navigation.render();
    
    if (appState.page === 'home') {
        slider.init();
    }

    // イベント委譲によるクリック管理
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        
        // ページ遷移判定
        const navElem = target.closest('[data-page]');
        if (navElem) {
            e.preventDefault();
            const page = navElem.getAttribute('data-page');
            const id = navElem.getAttribute('data-id');
            
            if (page) {
                navigation.goToPage(page, id);
                if (page === 'home') {
                    // 描画タイミングを合わせるためsetTimeoutを使用
                    setTimeout(() => slider.init(), 0);
                }
            }
            return;
        }

        // スライダー操作（次へ）
        if (target.closest('.slider-button-next')) {
            slider.slideNext();
            return;
        }

        // スライダー操作（前へ）
        if (target.closest('.slider-button-prev')) {
            slider.slidePrev();
            return;
        }

        // スライダー操作（ドット）
        const dot = target.closest('.slider-dot');
        if (dot) {
            const index = dot.getAttribute('data-index');
            if (index !== null) slider.goToSlide(parseInt(index, 10));
            return;
        }
    });
});