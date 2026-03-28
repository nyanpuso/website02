import { appState } from './state.js';
import { loadSlidesData } from './data.js';
let currentIndex = 0;

export const slider = {

    // DOM作成のみ
    render() {
console.log('slider.render called');
        const main = document.getElementById('main-content');
        if (!main) return;

        main.innerHTML = `
        <div id="slider-wrapper">

            <div class="slider-viewport">
                <div id="slider-track-home">
                    <div class="slider-item full-image-mode">
                        <div class="slider-item-image">
                            <img id="initial-slide-image" alt="">
                        </div>
                        <div class="slider-item-content"></div>
                    </div>
                </div>
            </div>

            <button id="next-btn" class="slider-button slider-btn-next">></button>
            <button id="prev-btn" class="slider-button slider-btn-prev"><</button>
            <div id="slider-dots" class="slider-dots"></div>

        
        </div>
        `;


const img = document.getElementById('initial-slide-image') as HTMLImageElement | null;
console.log('initial-slide-image:', img);
if (img) {
    img.src = './slides/images/entrance.png';
    console.log('画像 src を設定しました:', img.src);
} else {
    console.warn('1枚目の画像要素が見つかりません');
}

        // まず1枚目だけ表示
        // const img = document.getElementById('initial-slide-image') as HTMLImageElement | null;
        // if (img) {
        //     img.src = './slides/images/entrance.png'; // 仮
        // }

        // データ読み込み後に init() 呼び出し
        loadSlidesData().then(() => this.init());

    // データ読み込み後にスライド表示
// データ読み込み後にスライド表示
const wrapper = document.getElementById('slider-wrapper');
if (wrapper) wrapper.style.display = 'block';

const viewport = wrapper?.querySelector('.slider-viewport') as HTMLElement | null;
if (viewport) viewport.style.visibility = 'visible';

const initialImg = document.getElementById('initial-slide-image') as HTMLImageElement | null;
if (initialImg) initialImg.style.visibility = 'visible';

console.log('loadSlidesData resolved, calling init');
    },


    // スライド生成・イベント登録
    init() {
        const track = document.getElementById('slider-track-home');
console.log('slider-track-home:', track);
        if (!track) return;

console.log('slider.init');

        // 既存1枚目を保持
        const first = track.querySelector('.slider-item');
        if (!first) return;
console.log('1枚目のスライド:', first);
// 2枚目以降を追加
appState.slidesData.slice(1).forEach(slide => {
    const item = document.createElement('div');
    item.className = `slider-item ${slide.fullImage ? 'full-image-mode' : ''}`;
    item.innerHTML = `
        <div class="slider-item-image">
            <img src="${slide.image}" alt="${slide.title}">
        </div>
        <div class="slider-item-content">
            <h3>${slide.title}</h3>
            <p>${slide.description || ''}</p>
        </div>
    `;
    track.appendChild(item);
});

        // prev / next ボタンイベント（1回だけ登録）
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        prevBtn?.addEventListener('click', () => this.prev());
        nextBtn?.addEventListener('click', () => this.next());

        // 初期位置設定
        this.update();
    },

    prev() {
        const len = appState.slidesData.length;
        currentIndex = (currentIndex - 1 + len) % len;
        this.update();
    },

    next() {
        const len = appState.slidesData.length;
        currentIndex = (currentIndex + 1) % len;
        this.update();
    },

    update() {
        const track = document.getElementById('slider-track-home');
        if (!track) return;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
};