import { AppState } from "./types/state";
import { PageType } from "./types/page";
import { pages } from "./core/pages";
import { updateBreadcrumb } from "./core/breadcrumb";
import { initSlider, stopSliderAutoPlay } from "./slider/slider";
import { Slide } from "./types/slide";

const appState: AppState = {
    page: 'home',
    shopId: null,
    currentSlideIndex: 0,
    shopsData: [],
    slidesData: [],
    autoPlayTimer: null
};

export const app = {
    async init() {
        await this.loadAllData();
        this.setupEventListeners();
        this.render();
    },

    async loadAllData() {
        const [shopsRes, slidesRes] = await Promise.all([
            fetch('shops.json'),
            fetch('slides.json')
        ]);

        appState.shopsData = await shopsRes.json();
        appState.slidesData = (await slidesRes.json()).sort((a:Slide, b:Slide) => a.priority - b.priority);
    },

render() {
    const content = document.getElementById("main-content");
    if (!content) return;

    const page = pages[appState.page];
    content.innerHTML = page.template(appState);

    updateBreadcrumb(appState);

    if (appState.page === "home") {
        initSlider(appState);
    } else {
        stopSliderAutoPlay(appState);
    }
},

    goToPage(page: PageType, id: string | null = null) {
        appState.page = page;
        appState.shopId = id;
        this.render();
        window.scrollTo(0, 0);
    },

    setupEventListeners() {
        document.addEventListener('click', e => {
            const target = e.target as HTMLElement;

            const nav = target.closest('.nav-button, .slide-nav-button');
            if (nav) {
                const page = nav.getAttribute('data-page') as PageType;
                this.goToPage(page);
            }

            if (target.closest('.logo')) {
                this.goToPage('home');
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());