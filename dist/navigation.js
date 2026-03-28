import { appState } from './state.js';
import { slider } from './slider.js';
import { shops } from './shops.js';
const routes = {
    home: slider,
    shops: shops,
};
export const navigation = {
    goToPage(page) {
        if (window.monitor) {
            window.monitor.pause();
        }
        else {
            window.dbgLog?.('monitor not found');
        }
        console.log('goToPage:', page);
        appState.page = page;
        const route = routes[page];
        if (route) {
            route.render();
        }
    },
    init() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            const nav = target.closest('[data-page]');
            if (!nav)
                return;
            e.preventDefault();
            const page = nav.getAttribute('data-page');
            if (page)
                this.goToPage(page);
            // ページ切り替え後に slider が必要ならここで init を呼ぶことも可能
            if (page === 'home') {
                slider.init();
            }
            if (window.monitor) {
                window.monitor.pause();
            }
            else {
                window.dbgLog?.('monitor not found');
            }
        });
    }
};
