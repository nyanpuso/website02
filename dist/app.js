import { navigation } from './navigation.js';
import { debugTargets } from './utils/style-debugger-config.js';
import { StyleMonitor } from './utils/styleMonitor.js';
import { StyleDebuggerUI } from './utils/styleDebuggerUI.js';
document.addEventListener('DOMContentLoaded', () => {
    const monitor = new StyleMonitor(debugTargets);
    window.monitor = monitor; // グローバルに公開
    const ui = new StyleDebuggerUI();
    monitor.addEventListener('change', (e) => {
        const evt = e;
        ui.displayChange(evt.detail.key, evt.detail.value, evt.detail.changed);
        ui.logChange(evt.detail.key, evt.detail.value, evt.detail.logMode);
    });
    monitor.start();
    //ブレイクポイントは monitor.pause() / monitor.resume() で制御可能
    // // ブレイクポイント設定
    // ui.addBreakpoint({
    //     key: 'body:opacity',
    //     condition: value => value === '0.5'
    // });
    // ① ナビのクリックイベント登録
    navigation.init();
    monitor.pause(); //
    // ② 初期ページ表示（home）
    navigation.goToPage('home');
    // 外部JS例
    window['dbgLog'] = (msg) => ui.externalLog(msg);
    // 外部JSから呼べるログ関数を提供
    // <script>
    //     // ページ内のどこからでも呼べる
    //     window.dbgLog?.("render終了");
    // </script>
});
