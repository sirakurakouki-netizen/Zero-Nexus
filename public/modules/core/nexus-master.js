import { CONFIG } from '../shared/config.js';

export class NexusMaster {
    constructor() {
        // 聖典：Global State (世界の状態管理)
        this.state = {
            user: { name: 'Guest', level: 1, credits: 0 },
            currentMode: 'lobby',
            isServerOnline: false
        };

        // 聖典：Event Bus (神経網)
        this.events = new EventTarget();
    }

    async init() {
        console.log(`Nexus OS v${CONFIG.VERSION} Initializing...`);

        // サーバー稼働確認
        await this.checkServerStatus();

        // 他のシステム(VisualCore等)をここから起動する
        this.events.dispatchEvent(new CustomEvent('os_ready'));
    }

    async checkServerStatus() {
        try {
            const res = await fetch(`${CONFIG.SERVER_URL}/ping`);
            const data = await res.json();
            if (data.status === 'online') {
                this.state.isServerOnline = true;
                this.updateStatusLamp(true);
            }
        } catch (e) {
            console.error("Nexus Node is sleeping or blocked.");
            this.updateStatusLamp(false);
        }
    }

    updateStatusLamp(online) {
        const lamp = document.getElementById('status-lamp');
        const text = document.getElementById('status-text');
        if (lamp && text) {
            lamp.className = online ? 'active' : '';
            text.innerText = online ? "NODE: ONLINE" : "NODE: OFFLINE";
        }
    }

    // 聖典：報酬システムの基盤
    addCredits(amount) {
        this.state.user.credits += amount;
        console.log(`Credits Added: ${amount}. Total: ${this.state.user.credits}`);
    }
}

// 実行
const nexus = new NexusMaster();
window.nexus = nexus; // デバッグ用にグローバル公開
nexus.init();