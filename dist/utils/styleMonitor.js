export class StyleMonitor extends EventTarget {
    targets;
    lastValues = {};
    paused = false;
    constructor(targets) {
        super();
        this.targets = targets;
    }
    isPaused() {
        return this.paused;
    }
    pause() { this.paused = true; }
    resume() { this.paused = false; }
    async start() {
        for (;;) {
            if (this.paused) {
                await new Promise(r => requestAnimationFrame(r));
                continue;
            }
            for (const target of this.targets) {
                const el = document.querySelector(target.selector);
                for (const prop of target.props) {
                    const value = el ? getComputedStyle(el)[prop] : null;
                    const key = `${target.selector}:${prop}`;
                    const isInitial = !(key in this.lastValues);
                    const changed = !isInitial && this.lastValues[key] !== value;
                    if (isInitial) {
                        this.lastValues[key] = value;
                        continue; // 初期値は通知なし
                    }
                    if (changed) {
                        this.lastValues[key] = value;
                        this.dispatchEvent(new CustomEvent('change', {
                            detail: { key, value, changed, logMode: target.logMode || 'instant' }
                        }));
                    }
                }
            }
            await new Promise(r => requestAnimationFrame(r));
        }
    }
}
