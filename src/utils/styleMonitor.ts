export interface StyleChangeEvent {
    key: string;
    value: string | null;
    changed: boolean;
    logMode: 'instant' | 'queued';
}

import { DebugTarget } from './style-debugger-config.js';

export class StyleMonitor extends EventTarget {
    private targets: DebugTarget[];
    private lastValues: Record<string, string | null> = {};
    private paused: boolean = false;

    constructor(targets: DebugTarget[]) {
        super();
        this.targets = targets;
    }


    public isPaused() {
    return this.paused;
}

    public pause() { this.paused = true; }
    public resume() { this.paused = false; }

    public async start() {
        for (;;) {
            if (this.paused) {
                await new Promise(r => requestAnimationFrame(r));
                continue;
            }

            for (const target of this.targets) {
                const el = document.querySelector<HTMLElement>(target.selector);
                for (const prop of target.props) {
                    const value = el ? getComputedStyle(el)[prop as any] as string : null;
                    const key = `${target.selector}:${prop}`;
                    const isInitial = !(key in this.lastValues);
                    const changed = !isInitial && this.lastValues[key] !== value;

                    if (isInitial) {
                        this.lastValues[key] = value;
                        continue; // 初期値は通知なし
                    }

                    if (changed) {
                        this.lastValues[key] = value;
                        this.dispatchEvent(new CustomEvent<StyleChangeEvent>('change', {
                            detail: { key, value, changed, logMode: target.logMode || 'instant' }
                        }));
                    }
                }
            }

            await new Promise(r => requestAnimationFrame(r));
        }
    }
}