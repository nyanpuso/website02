export const homeTemplate = (): string => `
<div class="home-container">
    <div class="main-content-wrapper" id="home-wrapper">
        <!-- 初回表示用 -->
        <div class="welcome-block" id="welcome-block" style="display: none;">
            <img id="welcome-image" class="welcome-image" alt="ようこそ">
            <div class="welcome-text">
                <span class="typewriter" id="typewriter-text">ようこそ、大潟ショッピングセンターへ</span>
            </div>
        </div>

        <!-- スライド表示用 -->
        <div class="slider-container" id="slider-container" style="display: none;">
            <img id="slide-image" class="slide-image" alt="スライド画像">
            <div class="slide-content">
                <h3 class="slide-title" id="slide-title"></h3>
                <p class="slide-subtitle" id="slide-subtitle"></p>
                <p class="slide-description" id="slide-description"></p>
            </div>
        </div>
    </div>
</div>
`;