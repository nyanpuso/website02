/* ==========================================
   スライダー描画
   ========================================== */
export function initSlider(state) {
    const track = document.getElementById("slider-track-home");
    if (!track || !state.slidesData.length)
        return;
    // スライド描画
    track.innerHTML = state.slidesData
        .map((slide) => `
            <div class="slider-item ${slide.fullImage ? "full-image-mode" : ""}">
                <div class="slider-item-image">
                    <img src="${slide.image}" alt="${slide.title}">
                </div>
                <div class="slider-item-content">
                    <h3>${slide.title}</h3>
                    <p>${slide.description || ""}</p>
                </div>
            </div>
        `)
        .join("");
    // ドット描画
    const dots = document.getElementById("slider-dots");
    if (dots) {
        dots.innerHTML = state.slidesData
            .map((_, i) => `
                <button class="slider-dot" onclick="app.goToSlide(${i})"></button>
            `)
            .join("");
    }
    goToSlide(state, 0);
    startSliderAutoPlay(state);
}
/* ==========================================
   スライド移動
   ========================================== */
export function goToSlide(state, index) {
    const track = document.getElementById("slider-track-home");
    if (!track)
        return;
    state.currentSlideIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll(".slider-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}
export function slideNext(state) {
    if (!state.slidesData.length)
        return;
    const next = (state.currentSlideIndex + 1) % state.slidesData.length;
    goToSlide(state, next);
}
export function slidePrev(state) {
    if (!state.slidesData.length)
        return;
    const prev = (state.currentSlideIndex - 1 + state.slidesData.length) %
        state.slidesData.length;
    goToSlide(state, prev);
}
/* ==========================================
   自動再生
   ========================================== */
export function startSliderAutoPlay(state) {
    stopSliderAutoPlay(state);
    if (state.slidesData.length > 1) {
        state.autoPlayTimer = window.setInterval(() => {
            slideNext(state);
        }, 5000);
    }
}
export function stopSliderAutoPlay(state) {
    if (state.autoPlayTimer !== null) {
        clearInterval(state.autoPlayTimer);
        state.autoPlayTimer = null;
    }
}
//# sourceMappingURL=slider.js.map