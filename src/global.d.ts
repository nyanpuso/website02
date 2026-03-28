// グローバル型定義
// このファイルは import せずともプロジェクト全体で認識されます

import { StyleMonitor } from './utils/styleMonitor.js'; // monitor のクラス

declare global {
    interface Window {
        // スタイル監視用インスタンス
        monitor?: StyleMonitor;

        // デバッグ用ログ関数
        dbgLog?: (msg: string) => void;
    }
}

// 必須の export でモジュール化して TypeScript が認識するようにする
export {};