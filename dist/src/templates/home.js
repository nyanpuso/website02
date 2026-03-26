export const homeTemplate = () => `
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
