import { navigation } from './navigation';
import { slider } from './slider';
document.addEventListener('DOMContentLoaded', () => {
    navigation.render();
    slider.init();
});
window.goToShopDetail = (id) => {
    navigation.goToPage('shop-detail', id);
};
