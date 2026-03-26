import { appState } from '../state.js';
export const shopsTemplate = () => `
<div class="shops-container">
    <div class="home-intro"><h1>店舗一覧</h1></div>
    <div class="shops-grid">
        ${appState.shopsData.map(shop => `
            <div class="shop-card">
                <div class="shop-card-image">${shop.image}</div>
                <div class="shop-card-content">
                    <h3>${shop.name}</h3>
                    <p>${shop.category}</p>
                    <button class="shop-button" onclick="goToShopDetail('${shop.id}')">詳細を見る</button>
                </div>
            </div>
        `).join('')}
    </div>
</div>
`;
