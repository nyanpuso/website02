var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pages } from "./core/pages";
import { updateBreadcrumb } from "./core/breadcrumb";
import { initSlider, stopSliderAutoPlay } from "./slider/slider";
const appState = {
    page: 'home',
    shopId: null,
    currentSlideIndex: 0,
    shopsData: [],
    slidesData: [],
    autoPlayTimer: null
};
export const app = {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadAllData();
            this.setupEventListeners();
            this.render();
        });
    },
    loadAllData() {
        return __awaiter(this, void 0, void 0, function* () {
            const [shopsRes, slidesRes] = yield Promise.all([
                fetch('shops.json'),
                fetch('slides.json')
            ]);
            appState.shopsData = yield shopsRes.json();
            appState.slidesData = (yield slidesRes.json()).sort((a, b) => a.priority - b.priority);
        });
    },
    render() {
        const content = document.getElementById("main-content");
        if (!content)
            return;
        const page = pages[appState.page];
        content.innerHTML = page.template(appState);
        updateBreadcrumb(appState);
        if (appState.page === "home") {
            initSlider(appState);
        }
        else {
            stopSliderAutoPlay(appState);
        }
    },
    goToPage(page, id = null) {
        appState.page = page;
        appState.shopId = id;
        this.render();
        window.scrollTo(0, 0);
    },
    setupEventListeners() {
        document.addEventListener('click', e => {
            const target = e.target;
            const nav = target.closest('.nav-button, .slide-nav-button');
            if (nav) {
                const page = nav.getAttribute('data-page');
                this.goToPage(page);
            }
            if (target.closest('.logo')) {
                this.goToPage('home');
            }
        });
    }
};
document.addEventListener('DOMContentLoaded', () => app.init());
//# sourceMappingURL=app.js.map