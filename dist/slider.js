import { appState } from './state.js';
export const slider = {
    init() {
        const track = document.getElementById('slider-track-home');
        if (!track || !appState.slidesData.length)
            return;
        // スライドの中身を生成
        track.innerHTML = appState.slidesData.map((slide) => `
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
        // ドット（インジケーター）の生成
        const dots = document.getElementById('slider-dots');
        if (dots) {
            // ポイント：onclick を削除し、data-index を付与
            dots.innerHTML = appState.slidesData.map((_, i) => `
                <button class="slider-dot" data-index="${i}" aria-label="スライド ${i + 1}へ"></button>
            `).join('');
        }
        this.goToSlide(0);
        this.startAutoPlay();
    },
    goToSlide(index) {
        const track = document.getElementById('slider-track-home');
        if (!track)
            return;
        appState.currentSlideIndex = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        // ドットの活性状態を更新
        document.querySelectorAll('.slider-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    },
    slideNext() {
        if (!appState.slidesData.length)
            return;
        const next = (appState.currentSlideIndex + 1) % appState.slidesData.length;
        this.goToSlide(next);
    },
    slidePrev() {
        if (!appState.slidesData.length)
            return;
        const prev = (appState.currentSlideIndex - 1 + appState.slidesData.length) % appState.slidesData.length;
        this.goToSlide(prev);
    },
    startAutoPlay() {
        this.stopAutoPlay();
        if (appState.slidesData.length > 1) {
            appState.autoPlayTimer = window.setInterval(() => {
                this.slideNext();
            }, 5000);
        }
    },
    stopAutoPlay() {
        if (appState.autoPlayTimer !== null) {
            clearInterval(appState.autoPlayTimer);
            appState.autoPlayTimer = null;
        }
    }
};
