import { loadShopsData } from './data.js';
import { appState } from './state.js';

export const shops = {

    render() {
        const main = document.getElementById('main-content');
        if (!main) return;

        main.innerHTML = `<div id="shops-container">読み込み中...</div>`;

        loadShopsData().then(() => {
            this.draw();
        });
    },

    draw() {
        const container = document.getElementById('shops-container');
        if (!container) return;

        container.innerHTML = appState.shopsData.map(shop => `
            <div class="shop-card">
                <img src="${shop.image}" alt="${shop.name}">
                <h3>${shop.name}</h3>
                <p>${shop.description || ''}</p>
            </div>
        `).join('');
    }
};