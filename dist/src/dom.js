export const dom = {
    getContent: () => document.getElementById('main-content'),
    getBreadcrumb: () => document.getElementById('breadcrumb'),
    getMenuToggle: () => document.getElementById('menu-toggle')
};
export function getNavLabels() {
    const buttons = document.querySelectorAll('.main-nav .nav-button');
    const map = {};
    buttons.forEach(btn => {
        const page = btn.getAttribute('data-page');
        const label = btn.textContent?.trim() || "";
        if (page)
            map[page] = label;
    });
    return map;
}
