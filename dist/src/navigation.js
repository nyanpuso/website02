import { appState } from './state';
import { dom, getNavLabels } from './dom';
import { homeTemplate } from './templates/home';
import { shopsTemplate } from './templates/shops';
import { shopDetailTemplate } from './templates/shopDetail';
import { mapTemplate } from './templates/map';
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
        const navLabels = getNavLabels();
        const page = appState.page;
        const items = [];
        items.push({ label: navLabels["home"] || "ホーム", page: "home" });
        if (page === "shops")
            items.push({ label: navLabels["shops"] || "店舗一覧" });
        else if (page === "shop-detail") {
            const shop = appState.shopsData.find((s) => s.id === appState.shopId);
            items.push({ label: navLabels["shops"] || "店舗一覧", page: "shops" });
            items.push({ label: shop ? shop.name : "詳細" });
        }
        else if (navLabels[page])
            items.push({ label: navLabels[page] });
        breadcrumb.innerHTML = items.map(item => {
            if (item.page)
                return `<a href="#" onclick="navigation.goToPage('${item.page}'); return false;">${item.label}</a>`;
            return `<span>${item.label}</span>`;
        }).join("");
        // JSON-LD形式でパンくず生成
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": item.label,
                "item": item.page ? `${location.origin}/#${item.page}` : location.href
            }))
        };
        let script = document.getElementById('breadcrumb-jsonld');
        if (!script) {
            script = document.createElement('script');
            script.id = 'breadcrumb-jsonld';
            script.type = 'application/ld+json'; // HTMLScriptElementなら存在
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(jsonLd);
    }
};
