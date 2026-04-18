// Toppage2 - Board Interactive UI

interface Store {
    id: number;
    name: string;
    category: string;
    description: string;
}

interface EventItem {
    id: number;
    title: string;
    date: string;
    description: string;
    icon: string;
}

// サンプルデータ
const stores: Store[] = [
    {
        id: 1,
        name: "カフェ ブリッジ",
        category: "カフェ・ベーカリー",
        description: "こだわりのコーヒーと焼きたてのパン。朝の一杯から午後の休憩まで、くつろぎの時間をお過ごしください。"
    },
    {
        id: 2,
        name: "ファッション エスプレッソ",
        category: "アパレル",
        description: "流行の最新スタイルから定番ファッションまで。あなたのライフスタイルに似合う洋服がきっと見つかります。"
    },
    {
        id: 3,
        name: "書店 ページターナー",
        category: "書籍・文具",
        description: "小説からビジネス書、児童書まで豊富な品揃え。あなたの知的探求をサポートします。"
    },
    {
        id: 4,
        name: "レストラン サンセット",
        category: "飲食店",
        description: "新鮮な食材を使った和洋折衷料理。家族での食事から特別なデートまで、素敵な時間をお約束します。"
    },
    {
        id: 5,
        name: "美容室 ロータス",
        category: "美容・ヘルスケア",
        description: "最新のトレンドヘアから髪のお悩み相談まで。プロのスタイリストがあなたの美しさを引き出します。"
    },
    {
        id: 6,
        name: "雑貨店 アコースティック",
        category: "雑貨・生活用品",
        description: "暮らしを彩る個性的で素敵な雑貨たち。日常をちょっと豊かにするアイテムが揃っています。"
    }
];

const events: EventItem[] = [
    {
        id: 1,
        title: "春のセール",
        date: "2026年4月15日～5月15日",
        icon: "🎉",
        description: "全館春のセール開催！対象アイテムが最大50%OFF。この機会をお見逃しなく！"
    },
    {
        id: 2,
        title: "フェスティバル",
        date: "2026年5月3日～5月5日",
        icon: "🎪",
        description: "大型連休はショッピングセンターで大フェスティバル！ステージイベント、グルメ、ゲームコーナーなど盛りだくさん。"
    },
    {
        id: 3,
        title: "福袋企画",
        date: "2026年4月29日 先着順",
        icon: "🎁",
        description: "お得な福袋が登場！各店舗の福袋をご用意。先着順となりますので、お早めにお越しください。"
    }
];

// グローバル変数
let currentPage = 1;
let boardUI: BoardUI | null = null;

class BoardUI {
    constructor() {
        this.init();
    }

    init(): void {
        this.setupEventListeners();
        this.renderStores();
        this.renderEvents();
        this.updateNavigation();
    }

    setupEventListeners(): void {
        // 事務所・連絡先クリック
        const officeContact = document.getElementById('office-contact');
        if (officeContact) {
            officeContact.addEventListener('click', () => this.showContactModal());
        }

        // 店舗ボタンクリック
        const storesButton = document.getElementById('stores-button');
        if (storesButton) {
            storesButton.addEventListener('click', () => this.goToStores());
        }

        // 地図ボタンクリック（TODO: 地図ページに移動）
        const mapButton = document.getElementById('map-button');
        if (mapButton) {
            mapButton.addEventListener('click', () => {
                alert('地図ページはまだ実装されていません');
            });
        }

        // イベントカードクリック
        document.querySelectorAll('.event-card').forEach(eventCard => {
            eventCard.addEventListener('click', (e) => {
                const eventId = parseInt((e.currentTarget as HTMLElement).getAttribute('data-event') || '0');
                this.showEventModal(eventId);
            });
        });

        // モーダルの背景クリックで閉じる
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    renderStores(): void {
        const grid = document.getElementById('stores-grid');
        if (!grid) return;

        grid.innerHTML = stores.map(store => `
            <div class="store-loofa" onclick="boardUI.showStoreModal(${store.id})">
                <div class="store-name">${store.name}</div>
                <div class="store-category">${store.category}</div>
                <div class="store-description">${store.description}</div>
            </div>
        `).join('');
    }

    renderEvents(): void {
        const container = document.getElementById('flyers-container');
        if (!container) return;

        container.innerHTML = events.map(event => `
            <div class="flyer" onclick="boardUI.showEventModal(${event.id})">
                <div class="flyer-image">${event.icon}</div>
                <div class="flyer-title">${event.title}</div>
                <div class="flyer-date">${event.date}</div>
            </div>
        `).join('');
    }

    showContactModal(): void {
        const modal = document.getElementById('contact-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    showStoreModal(storeId: number): void {
        const store = stores.find(s => s.id === storeId);
        if (!store) return;

        const content = document.getElementById('store-modal-content');
        if (content) {
            content.innerHTML = `
                <div class="modal-title">🏪 ${store.name}</div>
                <div class="modal-body">
                    <p><strong>カテゴリー：</strong>${store.category}</p>
                    <p><strong>説明：</strong></p>
                    <p>${store.description}</p>
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        店舗ID: ${store.id}
                    </p>
                </div>
            `;
        }

        const modal = document.getElementById('store-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    showEventModal(eventId: number): void {
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        const content = document.getElementById('event-modal-content');
        if (content) {
            content.innerHTML = `
                <div class="modal-title">${event.icon} ${event.title}</div>
                <div class="modal-body">
                    <p><strong>開催日：</strong>${event.date}</p>
                    <p><strong>詳細：</strong></p>
                    <p>${event.description}</p>
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        イベントID: ${event.id}
                    </p>
                </div>
            `;
        }

        const modal = document.getElementById('event-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    goToStores(): void {
        this.transitionToPage(2);
    }

    goToEvents(eventId: number): void {
        // ターゲットイベントまでスクロール
        this.transitionToPage(3);
        setTimeout(() => {
            const flyer = document.querySelector(`.flyer[onclick*="${eventId}"]`) as HTMLElement;
            if (flyer) {
                flyer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                flyer.style.outline = '3px solid #ff6b6b';
                setTimeout(() => {
                    flyer.style.outline = '';
                }, 2000);
            }
        }, 600);
    }

    transitionToPage(pageNum: number): void {
        if (pageNum < 1 || pageNum > 3) return;

        const oldPage = document.getElementById(`page-${currentPage}`);
        const newPage = document.getElementById(`page-${pageNum}`);

        if (oldPage && newPage) {
            oldPage.classList.add('hidden');
            newPage.classList.remove('hidden');
            currentPage = pageNum;
            this.updateNavigation();
        }
    }

    updateNavigation(): void {
        const backBtn = document.getElementById('back-btn') as HTMLButtonElement;
        const forwardBtn = document.getElementById('forward-btn') as HTMLButtonElement;

        if (backBtn) {
            backBtn.disabled = currentPage === 1;
        }
        if (forwardBtn) {
            forwardBtn.disabled = currentPage === 3;
        }
    }

    drawArrows(): void {
        // 矢印の描画は複雑なため、後で実装
        // SVGで動的矢印を描画する処理
    }
}

// グローバル関数
function showContactModal(): void {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeContactModal(): void {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeStoreModal(): void {
    const modal = document.getElementById('store-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeEventModal(): void {
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function previousPage(): void {
    if (boardUI && currentPage > 1) {
        boardUI.transitionToPage(currentPage - 1);
    }
}

function nextPage(): void {
    if (boardUI && currentPage < 3) {
        boardUI.transitionToPage(currentPage + 1);
    }
}

// ウィンドウオブジェクトにバインド
(window as any).closeContactModal = closeContactModal;
(window as any).closeStoreModal = closeStoreModal;
(window as any).closeEventModal = closeEventModal;
(window as any).previousPage = previousPage;
(window as any).nextPage = nextPage;

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    boardUI = new BoardUI();
    (window as any).boardUI = boardUI;
});
