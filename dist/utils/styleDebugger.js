class StyleLogPanel {
    title;
    container;
    logQueue = [];
    timer;
    constructor(parent, title) {
        this.title = title;
        this.container = document.createElement('div');
        Object.assign(this.container.style, {
            border: '1px solid #888',
            marginBottom: '6px',
            padding: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
        });
        const titleDiv = document.createElement('div');
        titleDiv.textContent = title;
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.marginBottom = '2px';
        this.container.appendChild(titleDiv);
        parent.appendChild(this.container);
    }
    log(msg, mode = 'instant') {
        if (mode === 'instant') {
            const line = document.createElement('div');
            line.textContent = msg;
            this.container.appendChild(line);
            this.container.scrollTop = this.container.scrollHeight;
        }
        else {
            this.logQueue.push(msg);
            if (this.timer)
                clearTimeout(this.timer);
            this.timer = window.setTimeout(() => {
                if (this.logQueue.length > 0) {
                    const latest = this.logQueue[this.logQueue.length - 1];
                    const line = document.createElement('div');
                    line.textContent = latest;
                    this.container.appendChild(line);
                    this.container.scrollTop = this.container.scrollHeight;
                    this.logQueue = [];
                }
                this.timer = undefined;
            }, 1000);
        }
    }
}
export class StyleDebugger {
    targets;
    lastValues = {};
    paused = false;
    valuePanel; // 現在値一覧
    logContainer; // 下部ログパネル
    panels = new Map();
    constructor(targets) {
        this.targets = targets;
        // 現在値パネル（右上）
        this.valuePanel = document.createElement('div');
        Object.assign(this.valuePanel.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            width: '280px',
            maxHeight: '60vh',
            overflowY: 'auto',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: '9999',
            borderRadius: '4px'
        });
        document.body.appendChild(this.valuePanel);
        // 下部ログパネル
        this.logContainer = document.createElement('div');
        Object.assign(this.logContainer.style, {
            position: 'fixed',
            bottom: '0px',
            right: '10px',
            width: '300px',
            maxHeight: '60vh',
            overflowY: 'auto',
            zIndex: '9999'
        });
        document.body.appendChild(this.logContainer);
        this.startMonitoring();
    }
    // 外部からログ追加
    logExternal(msg) {
        const panelKey = 'ExternalLog';
        if (!this.panels.has(panelKey)) {
            this.panels.set(panelKey, new StyleLogPanel(this.logContainer, panelKey));
        }
        this.panels.get(panelKey).log(msg, 'instant');
    }
    // ブレイクポイント
    pause() { this.paused = true; }
    resume() { this.paused = false; }
    updateValuePanel(key, value, changed) {
        let row = this.valuePanel.querySelector(`[data-key="${key}"]`);
        if (!row) {
            row = document.createElement('div');
            row.dataset.key = key;
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.innerHTML = `<span>${key}</span><span class="value">${value ?? 'null'}</span>`;
            this.valuePanel.appendChild(row);
        }
        else {
            const span = row.querySelector('span.value');
            if (span) {
                span.textContent = value ?? 'null';
                if (changed) {
                    span.style.color = 'red';
                    setTimeout(() => span.style.color = '#fff', 500);
                }
            }
        }
    }
    async startMonitoring() {
        for (;;) {
            for (const target of this.targets) {
                const el = document.querySelector(target.selector);
                for (const prop of target.props) {
                    const value = el ? getComputedStyle(el)[prop] : null;
                    const key = `${target.selector}-${prop}`;
                    const isInitial = !(key in this.lastValues);
                    if (isInitial) {
                        this.lastValues[key] = value;
                        this.updateValuePanel(key, value, false);
                        continue;
                    }
                    if (this.lastValues[key] !== value) {
                        this.lastValues[key] = value;
                        this.updateValuePanel(key, value, true);
                        if (!this.panels.has(key)) {
                            this.panels.set(key, new StyleLogPanel(this.logContainer, key));
                        }
                        this.panels.get(key).log(`${value ?? 'null'}`, target.logMode ?? 'instant');
                    }
                }
            }
            while (this.paused) {
                await new Promise(r => setTimeout(r, 100));
            }
            await new Promise(r => requestAnimationFrame(r));
        }
    }
}
