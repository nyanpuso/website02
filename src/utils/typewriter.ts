/**
 * タイプライターアニメーション
 */
export class TypewriterAnimator {
    private container: HTMLElement;
    private text: string;
    private speed: number; // ミリ秒
    private onComplete?: () => void;

    constructor(
        container: HTMLElement,
        text: string,
        speed: number = 100,
        onComplete?: () => void
    ) {
        this.container = container;
        this.text = text;
        this.speed = speed;
        this.onComplete = onComplete;
    }

    start(): Promise<void> {
        return new Promise((resolve) => {
            this.container.textContent = '';
            let index = 0;

            const type = () => {
                if (index < this.text.length) {
                    this.container.textContent += this.text.charAt(index);
                    index++;
                    setTimeout(type, this.speed);
                } else {
                    this.onComplete?.();
                    resolve();
                }
            };

            type();
        });
    }

    stop(): void {
        this.container.textContent = this.text;
    }
}
