import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

export class NexusMaster {
    constructor() {
        this.version = "1.2.0-Streamer";
        this.visual = new VisualCore();
        this.input = new VirtualPad();
        this.player = new Player(this.visual);
        this.winManager = new WindowManager();
    }

    boot() {
        this.visual.init();
        this.input.init();
        this.player.init();
        this.setupOSControls();
        this.tick();
    }

    setupOSControls() {
        const appDrawer = document.getElementById('app-drawer');

        document.getElementById('nexus-menu-btn').onclick = (e) => {
            e.stopPropagation();
            appDrawer.classList.toggle('hidden');
        };

        // 🚀 ストリーミング再生ボタン
        document.getElementById('launch-yt').onclick = () => {
            appDrawer.classList.add('hidden');
            this.openVideoPlayer();
        };

        document.getElementById('launch-browser').onclick = () => {
            appDrawer.classList.add('hidden');
            this.openWebBrowser("https://www.bing.com");
        };
    }

    // 🎬 プレイヤー窓（iframeを使わず、自前のvideoタグで再生）
    openVideoPlayer() {
        const playerHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#000; color:#0ff;">
                <div style="padding:10px; display:flex; gap:5px; background:#111;">
                    <input type="text" id="video-url" placeholder="YouTube URL..." 
                        style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:5px; border-radius:4px; font-size:12px;">
                    <button id="video-load" style="background:#0ff; color:#000; border:none; padding:0 10px; border-radius:4px; font-weight:bold;">LOAD</button>
                </div>
                <div style="flex-grow:1; display:flex; align-items:center; justify-content:center; position:relative;">
                    <video id="nexus-video" controls autoplay style="width:100%; max-height:100%; border:1px solid #0ff; box-shadow: 0 0 20px #0ff;"></video>
                </div>
            </div>
        `;

        const win = this.winManager.createWindow("Nexus Stream Player", playerHtml, { width: 500, height: 350, x: 50, y: 50 });
        const loadBtn = win.querySelector('#video-load');
        const input = win.querySelector('#video-url');
        const video = win.querySelector('#nexus-video');

        loadBtn.onclick = () => {
            const val = input.value.trim();
            if(!val) return;
            // サーバーのストリーミング中継エンドポイントに投げる
            video.src = window.location.origin + "/video-stream?url=" + encodeURIComponent(val);
            console.log("[Stream] Attempting to play:", val);
        };
    }

    openWebBrowser(initialUrl = "") {
        const browserHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#111;">
                <div style="padding:10px; display:flex; gap:5px; background:#222;">
                    <input type="text" id="browser-url" value="${initialUrl}" style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:8px; border-radius:6px;">
                    <button id="browser-go" style="background:#0ff; color:#000; border:none; padding:0 15px; border-radius:6px; font-weight:bold;">GO</button>
                </div>
                <iframe id="browser-viewport" src="about:blank" style="flex-grow:1; border:none; background:white;"></iframe>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Browser", browserHtml, { width: 500, height: 400, x: 10, y: 40 });
        const goBtn = win.querySelector('#browser-go');
        const input = win.querySelector('#browser-url');
        const iframe = win.querySelector('#browser-viewport');

        goBtn.onclick = () => {
            iframe.src = window.location.origin + "/proxy?url=" + encodeURIComponent(input.value.trim());
        };
        if(initialUrl) goBtn.onclick();
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        this.player.update(this.input.getMovement());
        this.visual.update();
    }
}