export class StyleDebuggerUI {
    topPanel;
    logPanel;
    logTabs;
    itemPanel;
    timelinePanel;
    currentTab = 'timeline';
    logTimer;
    pendingLog = null;
    breakpoints = [];
    constructor() {
        // 右上パネル：現在値
        this.topPanel = document.createElement('div');
        Object.assign(this.topPanel.style, {
            position: 'fixed', top: '10px', right: '10px',
            width: '280px', maxHeight: '60vh', overflowY: 'auto',
            background: 'rgba(0,0,0,0.85)', color: '#fff',
            fontFamily: 'monospace', fontSize: '12px',
            padding: '8px', borderRadius: '4px', zIndex: '9999'
        });
        document.body.appendChild(this.topPanel);
        // 下パネル：ログ
        this.logPanel = document.createElement('div');
        Object.assign(this.logPanel.style, {
            position: 'fixed', bottom: '0px', left: '0px',
            width: '100%', height: '200px',
            minHeight: '100px', // 最小
            maxHeight: '80vh', // 最大,
            resize: 'vertical', // 上方向にドラッグでリサイズ可能
            overflow: 'auto', // 中身が多いとスクロール
            background: 'rgba(0,0,0,0.9)', color: '#fff',
            fontFamily: 'monospace', fontSize: '12px',
            padding: '4px', zIndex: '9999'
        });
        document.body.appendChild(this.logPanel);
        let startY = 0;
        let startHeight = 0;
        this.logPanel.addEventListener('mousedown', e => {
            startY = e.clientY;
            startHeight = this.logPanel.offsetHeight;
            const onMouseMove = (e) => {
                const diff = startY - e.clientY; // 上にドラッグで増える
                this.logPanel.style.height = `${Math.min(Math.max(startHeight + diff, 100), window.innerHeight * 0.8)}px`;
            };
            const onMouseUp = () => {
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        });
        // Resume ボタン作成
        const resumeBtn = document.createElement('button');
        resumeBtn.textContent = 'Resume';
        Object.assign(resumeBtn.style, {
            position: 'absolute',
            top: '4px',
            right: '4px',
            padding: '2px 6px',
            fontSize: '12px',
            cursor: 'pointer',
            zIndex: '10000'
        });
        this.logPanel.appendChild(resumeBtn);
        // 初期状態をボタン無効にしておく
        resumeBtn.disabled = true;
        resumeBtn.style.opacity = '0.5';
        // ボタンを押したとき
        resumeBtn.addEventListener('click', () => {
            if (window.monitor && window.monitor.isPaused()) { // paused のときだけ
                window.monitor.resume();
                this.appendLog('▶ Resume pressed');
                // Resumeしたら無効化
                resumeBtn.disabled = true;
                resumeBtn.style.opacity = '0.5';
            }
        });
        // 監視が止まったときにボタンを有効化する
        // StyleMonitor 側で pause() が呼ばれたらボタンを有効化
        const originalPause = window.monitor?.pause;
        if (window.monitor && originalPause) {
            window.monitor.pause = function (...args) {
                originalPause.apply(window.monitor);
                resumeBtn.disabled = false;
                resumeBtn.style.opacity = '1';
            };
        }
        // タブ
        this.logTabs = document.createElement('div');
        Object.assign(this.logTabs.style, { display: 'flex', gap: '4px', marginBottom: '4px' });
        this.logTabs.innerHTML = `
            <button data-tab="item">項目別</button>
            <button data-tab="timeline">タイムライン</button>
        `;
        this.logPanel.appendChild(this.logTabs);
        // タブ用パネル
        this.itemPanel = document.createElement('div');
        this.timelinePanel = document.createElement('div');
        Object.assign(this.itemPanel.style, { display: 'none', overflowY: 'auto', height: 'calc(100% - 24px)' });
        Object.assign(this.timelinePanel.style, { display: 'block', overflowY: 'auto', height: 'calc(100% - 24px)' });
        this.logPanel.appendChild(this.itemPanel);
        this.logPanel.appendChild(this.timelinePanel);
        // タブクリックで切替
        this.logTabs.addEventListener('click', e => {
            const btn = e.target;
            const tab = btn.dataset.tab;
            if (!tab)
                return;
            this.currentTab = tab;
            this.itemPanel.style.display = tab === 'item' ? 'block' : 'none';
            this.timelinePanel.style.display = tab === 'timeline' ? 'block' : 'none';
        });
        // グローバルログ関数
        window['dbgLog'] = (msg) => this.externalLog(msg);
    }
    // 現在値パネル更新
    displayChange(key, value, changed) {
        let row = this.topPanel.querySelector(`.row[data-key="${key}"]`);
        if (!row) {
            row = document.createElement('div');
            row.dataset.key = key;
            row.className = 'row';
            row.innerHTML = `<span>${key}</span>: <span class="value">${value}</span>`;
            this.topPanel.appendChild(row);
        }
        else {
            const valueSpan = row.querySelector('.value');
            valueSpan.textContent = value ?? 'null';
            if (changed) {
                valueSpan.style.color = 'red';
                setTimeout(() => valueSpan.style.color = '#fff', 500);
            }
        }
    }
    // ログパネル更新
    logChange(key, value, logMode) {
        // ブレイクポイントチェック
        for (const bp of this.breakpoints) {
            if (bp.key === key && bp.condition(value)) {
                this.appendLog(`BREAKPOINT [${key}] → ${value}`);
                debugger;
            }
        }
        const msg = `[${key}] → ${value}`;
        if (logMode === 'instant') {
            this.appendItemLog(key, msg);
        }
        else {
            this.pendingLog = msg;
            if (this.logTimer !== undefined)
                clearTimeout(this.logTimer);
            this.logTimer = window.setTimeout(() => {
                if (this.pendingLog)
                    this.appendItemLog(key, this.pendingLog);
                this.pendingLog = null;
                this.logTimer = undefined;
            }, 1000);
        }
    }
    appendItemLog(key, msg) {
        // keyごとの div を取得または作成
        let panel = this.itemPanel.querySelector(`.item-log[data-key="${key}"]`);
        if (!panel) {
            panel = document.createElement('div');
            panel.dataset.key = key;
            panel.className = 'item-log';
            panel.style.marginBottom = '4px';
            const title = document.createElement('div');
            title.style.fontWeight = 'bold';
            title.textContent = key;
            const container = document.createElement('div');
            container.className = 'item-container';
            container.style.display = 'inline'; // 横並び用
            panel.appendChild(title);
            panel.appendChild(container);
            this.itemPanel.appendChild(panel);
        }
        const container = panel.querySelector('.item-container');
        // msg から「値部分」だけを抽出して追記する
        // 例: "[#slider-wrapper:height] → 25.6px" から "25.6px"
        const match = msg.match(/→\s*(.+)$/);
        const valueStr = match ? match[1] : msg;
        // 横に追記用の span を作る
        const span = document.createElement('span');
        span.textContent = (container.textContent ? ' → ' : '') + valueStr;
        container.appendChild(span);
        // 横スクロール
        container.scrollLeft = container.scrollWidth;
        // タイムラインには従来通り追加
        const line2 = document.createElement('div');
        line2.textContent = msg;
        this.timelinePanel.appendChild(line2);
        this.timelinePanel.scrollTop = this.timelinePanel.scrollHeight;
    }
    // 外部JSから呼べる console.log 相当
    externalLog(msg) {
        const line = document.createElement('div');
        line.textContent = msg;
        this.timelinePanel.appendChild(line);
        this.timelinePanel.scrollTop = this.timelinePanel.scrollHeight;
    }
    appendLog(msg) {
        // タイムラインに表示
        const line = document.createElement('div');
        line.textContent = msg;
        this.timelinePanel.appendChild(line);
        this.timelinePanel.scrollTop = this.timelinePanel.scrollHeight;
    }
    // ブレイクポイント追加
    addBreakpoint(bp) {
        this.breakpoints.push(bp);
    }
}
