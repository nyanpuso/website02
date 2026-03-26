export type PageType = 'home' | 'shops' | 'shop-detail' | 'map' | 'events';

export interface PageConfig {
  label: string;
  parent?: PageType; // 親ページのID。home以外はこれを持つ
}

export interface Shop {
    id: string;
    name: string;
    category: string;
    image: string;
    hours: string;
    tel: string;
    address: string;
    description: string;
}

export interface Slide {
    image: string;
    title: string;
    description?: string;
    priority: number;
    fullImage?: boolean;
}

export interface AppState {
    page: PageType;
    shopId: string | null;
    currentSlideIndex: number;
    shopsData: Shop[];
    slidesData: Slide[];
    autoPlayTimer: number | null;
}