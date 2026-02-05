import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

/**
 * NexusMaster - Version 1.0.4-Alpha
 * [Integration & UI Fix Update]
 * 全ての思想、掟、構成を統合した Zero-Nexus 司令塔。
 */
export class NexusMaster {
    constructor() {
        this.version = "1.0.4-Alpha";

        // 1. 各システム（器）のインスタンス化
        this.visual = new VisualCore();
        this.input = new VirtualPad();
        this.player = new Player(this.visual);
        this.winManager = new WindowManager(); // ウィンドウ管理システム

        // 共通データ（思想：何をやっても報酬が入る）
        this.currency = 0;
        this.level = 1;
    }

    /**
     * システム起動
     */
    boot() {
        console.log(`[Zero-Nexus] System Booting: ${this.version}`);

        try {
            // モジュール群の初期化
            this.visual.init();
            this.input.init();
            this.player.init();

            // OSインターフェースの紐付け（ボタン反応の修正）
            this.setupOSControls();

            // メインループ開始
            this.tick();

            console.log("[Zero-Nexus] System Online. Welcome, Zero.");
        } catch (error) {
            console.error("[Zero-Nexus] Boot Error:", error);
        }
    }

    /**
     * OSインターフェース（ボタン）のイベントリスナー設定
     */
    setupOSControls() {
        // YouTube起動
        const ytBtn = document.getElementById('launch-yt');
        if (ytBtn) {
            ytBtn.onclick = (e) => {
                e.stopPropagation();
                console.log("[OS] Launching YouTube...");
                this.winManager.openYouTube("dQw4w9WgXcQ");
            };
        }

        // 仮想ブラウザ起動
        const browserBtn = document.getElementById('launch-browser');
        if (browserBtn) {
            browserBtn.onclick = (e) => {
                e.stopPropagation();
                console.log("[OS] Launching Browser...");
                this.openWebBrowser();
            };
        }

        // 戦闘HUD：攻撃ボタン（報酬テスト用）
        const attackBtn = document.getElementById('btn-attack');
        if (attackBtn) {
            attackBtn.onclick = () => {
                this.addReward(10, "play");
            };
        }
    }

    /**
     * 仮想ブラウザ窓の生成（プロキシ連携）
     */
    openWebBrowser() {
        const browserHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#111;">
                <div style="padding:8px; display:flex; gap:5px; background:#222; border-bottom:1px solid #0ff;">
                    <input type="text" id="browser-url" placeholder="google.com" 
                        style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:5px 10px; font-size:12px; border-radius:4px; outline:none;">
                    <button id="browser-go" style="background:#0ff; color:#000; border:none; padding:0 15px; font-size:12px; font-weight:bold; border-radius:4px; cursor:pointer;">GO</button>
                </div>
                <iframe id="browser-viewport" src="about:blank" 
                    style="flex-grow:1; border:none; background:white; width:100%; height:100%;"></iframe>
            </div>
        `;

        const win = this.winManager.createWindow(
            "Web Browser / 仮想ブラウザ", 
            browserHtml, 
            { width: 450, height: 320, x: 50, y: 120 }
        );

        const goBtn = win.querySelector('#browser-go');
        const input = win.querySelector('#browser-url');
        const iframe = win.querySelector('#browser-viewport');

        goBtn.onclick = () => {
            let url = input.value;
            if (!url) return;
            if (!url.startsWith('http')) url = 'https://' + url;

            // サーバー側のプロキシを経由
            iframe.src = `/proxy?url=${encodeURIComponent(url)}`;
            console.log(`[Browser] Proxy Request: ${url}`);
        };
    }

    /**
     * メインループ（毎フレーム実行）
     */
    tick() {
        requestAnimationFrame(() => this.tick());

        // プレイヤーの物理更新
        const movementInput = this.input.getMovement();
        this.player.update(movementInput);

        // 描画系の更新
        this.visual.update();
    }

    /**
     * 報酬システム（思想：何をしても価値がある）
     */
    addReward(amount, type = "play") {
        let multiplier = (type === "clear") ? 1.0 : (type === "fail") ? 0.3 : 0.1;
        const gained = Math.floor(amount * multiplier);
        this.currency += gained;

        const creditsEl = document.getElementById('credits');
        if (creditsEl) {
            creditsEl.innerText = `Credits: ${this.currency}`;
            // 視覚的フィードバック
            creditsEl.style.color = '#0ff';
            setTimeout(() => { creditsEl.style.color = 'white'; }, 200);
        }
    }
}