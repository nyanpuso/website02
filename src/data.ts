import { appState } from './state.js';

let cache: any = null;

async function fetchData() {
    if (cache) return cache;

    const res = await fetch('./data.json');
    cache = await res.json();
    return cache;
}

// スライド用
export async function loadSlidesData() {
    if (appState.slidesData.length > 0) return;

    const data = await fetchData();
    appState.slidesData = data.slides || [];
}

// 店舗用
export async function loadShopsData() {
    if (appState.shopsData.length > 0) return;

    const data = await fetchData();
    appState.shopsData = data.shops || [];
}