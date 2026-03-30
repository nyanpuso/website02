import { appState } from './state.js';
import { loadSlidesData } from './data.js';

// currentIndex は export せず、このファイル内でのみ管理
let currentIndex = 0;

export const slider = {
    render(): void {
        const main = document.getElementById('main-content');
        if (!main) return;

        // 1. 静的プレースホルダーを配置（CSSクラスは共通）
        main.innerHTML = `
        <div id="slider-wrapper" class="slider-wrapper">
            <div class="slider-viewport">
                <div id="static-first-slide" class="slider-item full-image-mode">
                    <div class="slider-item-image">
                        <img id="initial-slide-image" alt="メイン画像" 
                             style="visibility: hidden; opacity: 0; transition: opacity 0.3s;">
                    </div>
                </div>
            </div>
        </div>
        `;

        // TypeScript型キャスト: HTMLElement ではなく HTMLImageElement として扱う
        const img = document.getElementById('initial-slide-image') as HTMLImageElement | null;
        
        if (img) {
            img.onload = () => {
                img.style.visibility = 'visible';
                img.style.opacity = '1';
            };
            img.src = './slides/images/entrance.png';
        }

        // 2. データのロード後に init を実行
        loadSlidesData().then(() => this.init());
    },

    init(): void {
        const wrapper = document.getElementById('slider-wrapper');
        const viewport = wrapper?.querySelector('.slider-viewport');
        // 型ガード
        if (!wrapper || !viewport) return;

        const track = document.createElement('div');
        track.id = 'slider-track-home';

        // slide と index に型を指定（型エラー 7006 の解消）
        appState.slidesData.forEach((slide: any, index: number) => {
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

        viewport.innerHTML = ''; 
        viewport.appendChild(track);

        // ボタンの追加（スライダーが準備できてから）
        wrapper.insertAdjacentHTML('beforeend', `
            <button id="next-btn" class="slider-button slider-btn-next">></button>
            <button id="prev-btn" class="slider-button slider-btn-prev"><</button>
            <div id="slider-dots" class="slider-dots"></div>
        `);

        document.getElementById('prev-btn')?.addEventListener('click', () => this.prev());
        document.getElementById('next-btn')?.addEventListener('click', () => this.next());

        this.update();
    },

    prev(): void {
        const len = appState.slidesData.length;
        currentIndex = (currentIndex - 1 + len) % len;
        this.update();
    },

    next(): void {
        const len = appState.slidesData.length;
        currentIndex = (currentIndex + 1) % len;
        this.update();
    },

    update(): void {
        const track = document.getElementById('slider-track-home');
        if (track) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }
};