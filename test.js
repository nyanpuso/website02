import { StyleDebugger } from './dist/utils/styleDebugger.js';

// 監視対象設定
const targets = [
    { selector: '#box1', props: ['width', 'height', 'backgroundColor', 'display'] },
    { selector: '#box2', props: ['width', 'height', 'backgroundColor', 'display'] }
];

const debuggerPanel = new StyleDebugger(targets);

// ボタン操作でスタイルを変更
document.getElementById('btn-change')?.addEventListener('click', () => {
    const box1 = document.getElementById('box1');
    const box2 = document.getElementById('box2');
    if (box1) box1.style.backgroundColor = box1.style.backgroundColor === 'red' ? 'blue' : 'red';
    if (box2) box2.style.backgroundColor = box2.style.backgroundColor === 'yellow' ? 'green' : 'yellow';
});

document.getElementById('btn-hide')?.addEventListener('click', () => {
    const box1 = document.getElementById('box1');
    const box2 = document.getElementById('box2');
    if (box1) box1.style.display = box1.style.display === 'none' ? 'block' : 'none';
    if (box2) box2.style.display = box2.style.display === 'none' ? 'block' : 'none';
});