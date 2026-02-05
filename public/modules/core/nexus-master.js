import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

/**
 * NexusMaster - Version 1.0.3-Alpha
 * [Proxy & Logic Link Update]
 * 仮想ブラウザのプロキシ連携とOSコントロールの強化。
 */
export class NexusMaster {
    constructor() {
        this.version = "1.0.3-Alpha";

        // システム初期化
        this.visual = new VisualCore();
        this.input = new VirtualPad();
        this.player = new Player(this.visual);
        this.winManager = new WindowManager();

        // 共通データ
        this.currency = 0;
        this.level = 1;
    }

    /**
     * システム起動
     */
    boot() {
        console.log(`[Zero-Nexus] System Booting: ${this.version}`);

        // モジュール群の初期化
        this.visual.init();
        this.input.init();
        this.player.init();

        // UIイベントの紐付け
        this.setupOSControls();

        // メインループ開始
        this.tick();

        console.log("[Zero-Nexus] All Systems Nominal. Welcome, Zero.");
    }

    /**
     * OSインターフェース（ボタン）の制御
     */
    setupOSControls() {
        // YouTube起動
        const ytBtn = document.getElementById('launch-yt');
        if (ytBtn) {
            ytBtn.onclick = () => {
                // デフォルト動画（Rickrollはテストの基本）
                this.winManager.openYouTube("dQw4w9WgXcQ");
            };
        }

        // 仮想ブラウザ起動
        const browserBtn = document.getElementById('launch-browser');
        if (browserBtn) {
            browserBtn.onclick = () => {
                this.openWebBrowser();
            };
        }

        // 戦闘HUDの報酬テスト
        const attackBtn = document.getElementById('btn-attack');
        if (attackBtn) {
            attackBtn.onclick = () => this.addReward(10, "play");
        }
    }

    /**
     * 仮想ブラウザ窓の生成（プロキシ連携版）
     */
    openWebBrowser() {
        const browserHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#111;">
                <div style="padding:5px; display:flex; gap:5px; background:#222;">
                    <input type="text" id="browser-url" placeholder="google.com" 
                        style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:4px 8px; font-size:12px; border-radius:4px;">
                    <button id="browser-go" style="background:#0ff; color:#000; border:none; padding:0 12px; font-size:12px; font-weight:bold; border-radius:4px;">GO</button>
                </div>
                <iframe id="browser-viewport" src="about:blank" 
                    style="flex-grow:1; border:none; background:white; width:100%; height:100%;"></iframe>
            </div>
        `;
        const win = this.winManager.createWindow("Web Browser / 仮想ブラウザ", browserHtml, { width: 450, height: 320, x: 50, y: 120 });

        const goBtn = win.querySelector('#browser-go');
        const input = win.querySelector('#browser-url');
        const iframe = win.querySelector('#browser-viewport');

        goBtn.onclick = () => {
            let url = input.value;
            if (!url) return;
            if (!url.startsWith('http')) url = 'https://' + url;

            // 🛡️ 重要：サーバー側の/proxyエンドポイントを経由させる
            // これによりX-Frame-Options制限を回避して表示を試みる
            iframe.src = `/proxy?url=${encodeURIComponent(url)}`;

            console.log(`[Browser] Proxying: ${url}`);
        };
    }

    /**
     * メインループ
     */
    tick() {
        requestAnimationFrame(() => this.tick());

        // プレイヤー移動の更新（入力値を渡す）
        const movementInput = this.input.getMovement();
        this.player.update(movementInput);

        // 描画更新
        this.visual.update();
    }

    /**
     * 報酬・経済システム
     */
    addReward(amount, type = "play") {
        let multiplier = 0.1;
        if (type === "clear") multiplier = 1.0;
        if (type === "fail") multiplier = 0.3;

        const gained = Math.floor(amount * multiplier);
        this.currency += gained;

        const creditsEl = document.getElementById('credits');
        if (creditsEl) creditsEl.innerText = `Credits: ${this.currency}`;
    }
}