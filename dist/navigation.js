import { appState, PAGE_CONFIG } from './state.js';
import { dom } from './dom.js';
import { homeTemplate } from './templates/home.js';
import { shopsTemplate } from './templates/shops.js';
import { shopDetailTemplate } from './templates/shopDetail.js';
import { mapTemplate } from './templates/map.js';
export const navigation = {
    render() {
        const content = dom.getContent();
        if (!content)
            return;
        if (appState.page === 'home')
            content.innerHTML = homeTemplate();
        else if (appState.page === 'shops')
            content.innerHTML = shopsTemplate();
        else if (appState.page === 'shop-detail')
            content.innerHTML = shopDetailTemplate(appState.shopId);
        else if (appState.page === 'map')
            content.innerHTML = mapTemplate();
        this.updateBreadcrumb();
        console.log("Render直後の DOM チェック:", document.getElementById('main-content')?.innerHTML.substring(0, 100));
    },
    goToPage(page, id = null) {
        appState.page = page;
        appState.shopId = id;
        this.render();
        window.scrollTo(0, 0);
    },
    updateBreadcrumb() {
        const breadcrumb = dom.getBreadcrumb();
        if (!breadcrumb)
            return;
        const { page, shopId, shopsData } = appState;
        const steps = [];
        // 【修正ポイント1】 currentKey の型を string | undefined ではなく PageType | undefined にする
        let currentKey = page;
        while (currentKey) {
            const rawConfig = PAGE_CONFIG[currentKey];
            // 2. config が存在しない（親がもういない）場合はループを抜ける
            if (!rawConfig)
                break;
            // 3. 型を明示的に指定して代入する（これで TS7022 が消えます）
            const config = rawConfig;
            let name = config.label;
            if (currentKey === 'shop-detail') {
                const shop = shopsData.find((s) => s.id === shopId);
                if (shop)
                    name = shop.name;
            }
            steps.unshift({
                name: name,
                url: `${location.origin}/#${currentKey}`,
                key: currentKey
            });
            // 親階層へ移動
            currentKey = config.parent;
        }
        // JSON-LDの注入
        this.injectJsonLd(steps);
        // HTMLの描画
        breadcrumb.innerHTML = steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            if (isLast) {
                return `<span class="breadcrumb-current">${step.name}</span>`;
            }
            return `<a href="#" data-page="${step.key}">${step.name}</a>`;
        }).join('<span class="separator"> &gt; </span>');
    },
    injectJsonLd(steps) {
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": steps.map((step, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": step.name,
                "item": step.url
            }))
        };
        let script = document.getElementById('breadcrumb-jsonld');
        if (!script) {
            script = document.createElement('script');
            script.id = 'breadcrumb-jsonld';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(jsonLd, null, 2);
    }
};
