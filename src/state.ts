// src/state.ts
import { AppState, PageConfig, PageType } from './types.js';

// 各ページの階層構造を一括管理（ここを編集するだけでパンくずが変わる）
export const PAGE_CONFIG: Record<PageType, PageConfig> = {
  'home': { label: 'ホーム' },
  'shops': { label: '店舗一覧', parent: 'home' },
  'shop-detail': { label: '店舗詳細', parent: 'shops' },
  'map': { label: '地図', parent: 'home' },
  'events': { label: 'イベント', parent: 'home' }
};

export const appState: AppState = {
  page: 'home',
  shopId: null,
  currentSlideIndex: 0,
  shopsData: [] as any[],
  slidesData: [] as any[],
  autoPlayTimer: null
};