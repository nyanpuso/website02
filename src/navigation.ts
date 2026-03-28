import { appState } from './state.js';
import { slider } from './slider.js';
import { shops } from './shops.js';

type PageType = 'home' | 'shops';

const routes: Record<PageType, any> = {
    home: slider,
    shops: shops,
};

export const navigation = {


    goToPage(page: PageType) {
if (window.monitor) {
    window.monitor.pause();
}else{window.dbgLog?.('monitor not found'); }

console.log('goToPage:', page);
        appState.page = page;

        const route = routes[page];
        if (route) {
            route.render();
        }
    },

    init() {
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const nav = target.closest('[data-page]') as HTMLElement;

            if (!nav) return;

            e.preventDefault();
            const page = nav.getAttribute('data-page') as PageType;
            if (page) this.goToPage(page);

            // ページ切り替え後に slider が必要ならここで init を呼ぶことも可能
            if (page === 'home') {
                slider.init();
            }
if (window.monitor) {
    window.monitor.pause();
}else{window.dbgLog?.('monitor not found'); }
        });
    }
};