import { navigation } from './navigation.js';
import { slider } from './slider.js';
import { appState } from './state.js';

/**
 * データのロード処理
 * data.json からスライドと店舗のデータを取得します
 */
async function loadAllData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        appState.slidesData = data.slides || [];
        appState.shopsData = data.shops || [];
        console.log("1. データのロード完了:", appState);
    } catch (error) {
        console.error("データの読み込みに失敗しました:", error);
        // 失敗しても動くように最低限の空配列を保証
        appState.slidesData = [];
        appState.shopsData = [];
    }
}

/**
 * メインの初期化処理
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log("2. DOMContentLoaded: 開始");

    // データのロードを待機
    await loadAllData();

    // 初期描画（現在の appState.page に基づく）
    navigation.render();
    console.log("3. 初期描画完了:", appState.page);

    // ホーム画面ならスライダーを初期化
    if (appState.page === 'home') {
        slider.init();
        console.log("4. スライダー初期化完了");
    }

    /**
     * イベント委譲によるクリック管理
     * 画面全体（document）でクリックを監視し、ターゲットを判定します
     */
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        
        // --- A. ページ遷移の判定 ([data-page] を持つ要素) ---
        const navElem = target.closest('[data-page]');
        if (navElem) {
            e.preventDefault();
            const page = navElem.getAttribute('data-page');
            const id = navElem.getAttribute('data-id');
            
            if (page) {
                console.log("ナビゲーション実行:", page, id);
                navigation.goToPage(page, id);
                
                // ページ遷移後にホームに戻ったならスライダーを再初期化
                if (page === 'home') {
                    // DOMが更新されるのを一瞬待ってから実行
                    setTimeout(() => slider.init(), 0);
                }
            }
            return;
        }

        // --- B. スライダー操作：次へ ---
        if (target.closest('.slider-button-next')) {
            console.log("スライダー：次へ");
            slider.slideNext();
            return;
        }

        // --- C. スライダー操作：前へ ---
        if (target.closest('.slider-button-prev')) {
            console.log("スライダー：前へ");
            slider.slidePrev();
            return;
        }

        // --- D. スライダー操作：ドット ---
        const dot = target.closest('.slider-dot');
        if (dot) {
            const index = dot.getAttribute('data-index');
            if (index !== null) {
                console.log("スライダー：ドットクリック", index);
                slider.goToSlide(parseInt(index, 10));
            }
            return;
        }
    });
});