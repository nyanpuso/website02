import { appState } from '../state.js';

export const shopDetailTemplate = (shopId: string | null): string => {
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