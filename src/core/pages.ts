import { PageType } from "../types/page";
import { AppState } from "../types/state";

import { homeTemplate } from "../templates/home";
import { shopsTemplate } from "../templates/shops";
import { shopDetailTemplate } from "../templates/shopDetail";
import { mapTemplate } from "../templates/map";

export interface BreadcrumbItem {
    label: string;
    page?: PageType;
}

export interface PageConfig {
    template: (state: AppState) => string;
    breadcrumb: (state: AppState) => BreadcrumbItem[];
}

export const pages: Record<PageType, PageConfig> = {
    home: {
        template: () => homeTemplate(),
        breadcrumb: () => []
    },

    shops: {
        template: (state) => shopsTemplate(state.shopsData),
        breadcrumb: () => [
            { label: "ホーム", page: "home" },
            { label: "店舗一覧" }
        ]
    },

    "shop-detail": {
        template: (state) => {
            const shop = state.shopsData.find(s => s.id === state.shopId);
            return shopDetailTemplate(shop);
        },
        breadcrumb: (state) => {
            const shop = state.shopsData.find(s => s.id === state.shopId);
            return [
                { label: "ホーム", page: "home" },
                { label: "店舗一覧", page: "shops" },
                { label: shop ? shop.name : "詳細" }
            ];
        }
    },

    map: {
        template: () => mapTemplate(),
        breadcrumb: () => [
            { label: "ホーム", page: "home" },
            { label: "地図" }
        ]
    }
};