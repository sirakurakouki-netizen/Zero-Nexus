import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

/**
 * NexusMaster - Version 1.0.2-Alpha
 * [OS Evolution Update]
 * ゲーム機能とOSマルチタスク機能を完全統合。
 */
export class NexusMaster {
    constructor() {
        this.version = "1.0.2-Alpha";

        // 1. 各システム（器）のインスタンス化
        this.visual = new VisualCore();
        this.input = new VirtualPad();
        this.player = new Player(this.visual);
        this.winManager = new WindowManager(); // OS窓管理システムの導入

        // 共通データ
        this.currency = 0;
        this.level = 1;
    }

    /**
     * システム起動
     */
    boot() {
        console.log(`[Zero-Nexus] System Booting: ${this.version}`);

        // 各モジュールの初期化
        this.visual.init();
        this.input.init();
        this.player.init();

        // OSボタンのイベント紐付け
        this.setupOSControls();

        // メインループ開始
        this.tick();

        console.log("[Zero-Nexus] All Systems Nominal. Welcome, Zero.");
    }

    /**
     * OSインターフェースの制御
     */
    setupOSControls() {
        // YouTube起動ボタン
        const ytBtn = document.getElementById('launch-yt');
        if (ytBtn) {
            ytBtn.onclick = () => {
                // デフォルトで特定の動画（または検索窓）を開く
                this.winManager.openYouTube("dQw4w9WgXcQ"); // テスト用ID
            };
        }

        // 仮想ブラウザ起動ボタン
        const browserBtn = document.getElementById('launch-browser');
        if (browserBtn) {
            browserBtn.onclick = () => {
                this.openWebBrowser();
            };
        }

        // 戦闘HUDのデモ（思想：報酬システムの確認用）
        const attackBtn = document.getElementById('btn-attack');
        if (attackBtn) {
            attackBtn.onclick = () => this.addReward(10, "play");
        }
    }

    /**
     * 仮想ブラウザ窓の生成（思想：ネットサーフィン機能）
     */
    openWebBrowser() {
        const browserHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#111;">
                <div style="padding:5px; display:flex; gap:5px;">
                    <input type="text" id="browser-url" placeholder="https://..." 
                        style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:2px 5px; font-size:10px;">
                    <button id="browser-go" style="background:#0ff; color:#000; border:none; padding:0 10px; font-size:10px; font-weight:bold;">GO</button>
                </div>
                <iframe id="browser-viewport" src="about:blank" style="flex-grow:1; border:none; background:white;"></iframe>
            </div>
        `;
        const win = this.winManager.createWindow("Web Browser / 仮想ブラウザ", browserHtml, { width: 400, height: 300, x: 50, y: 150 });

        // URL遷移ロジック（※プロキシが必要な場合は後にindex.jsと連携）
        const goBtn = win.querySelector('#browser-go');
        const input = win.querySelector('#browser-url');
        const iframe = win.querySelector('#browser-viewport');

        goBtn.onclick = () => {
            let url = input.value;
            if (!url.startsWith('http')) url = 'https://' + url;
            iframe.src = url; 
            console.log(`[Browser] Navigating to: ${url}`);
        };
    }

    /**
     * メインループ
     */
    tick() {
        requestAnimationFrame(() => this.tick());

        const movementInput = this.input.getMovement();
        this.player.update(movementInput);
        this.visual.update();
    }

    /**
     * 報酬システム
     */
    addReward(amount, type = "play") {
        let multiplier = (type === "clear") ? 1.0 : (type === "fail") ? 0.3 : 0.1;
        const gained = Math.floor(amount * multiplier);
        this.currency += gained;

        const creditsEl = document.getElementById('credits');
        if (creditsEl) creditsEl.innerText = `Credits: ${this.currency}`;
    }
}