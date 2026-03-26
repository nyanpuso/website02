export const dom = {
    getContent: (): HTMLElement | null => document.getElementById('main-content'),
    getBreadcrumb: (): HTMLElement | null => document.getElementById('breadcrumb'),
    getMenuToggle: (): HTMLInputElement | null => document.getElementById('menu-toggle') as HTMLInputElement | null
};

export function getNavLabels(): Record<string, string> {
    const buttons = document.querySelectorAll('.main-nav .nav-button');
    const map: Record<string, string> = {};
    buttons.forEach(btn => {
        const page = btn.getAttribute('data-page');
        const label = btn.textContent?.trim() || "";
        if (page) map[page] = label;
    });
    return map;
}