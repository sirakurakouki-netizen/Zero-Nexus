import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

export class NexusMaster {
    constructor() {
        this.version = "1.3.0-Stable";
        // 🚀 君のReplit実行用URL（ここが間違っていると404や通信不可になる）
        this.serverUrl = "https://cca3af0f-34bf-4500-a3da-ac5a034fb110-00-3dcqrois903qa.sisko.replit.dev";

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

        document.getElementById('launch-yt').onclick = () => {
            appDrawer.classList.add('hidden');
            this.openVideoPlayer();
        };

        document.getElementById('launch-browser').onclick = () => {
            appDrawer.classList.add('hidden');
            this.openWebBrowser("https://www.bing.com");
        };
    }

    openVideoPlayer() {
        const playerHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#000; color:#0ff; font-family:monospace;">
                <div style="padding:10px; display:flex; gap:5px; background:#111;">
                    <input type="text" id="video-url" placeholder="Paste YouTube URL..." 
                        style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:5px; border-radius:4px;">
                    <button id="video-load" style="background:#0ff; color:#000; border:none; padding:0 10px; border-radius:4px; font-weight:bold;">LOAD</button>
                </div>
                <div style="flex-grow:1; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                    <video id="nexus-video" controls autoplay style="width:100%; max-height:80%;"></video>
                    <p style="font-size:10px; color:#555; margin-top:5px;">Streaming via Nexus Server</p>
                </div>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Stream", playerHtml, { width: 450, height: 350, x: 20, y: 60 });
        const loadBtn = win.querySelector('#video-load');
        const input = win.querySelector('#video-url');
        const video = win.querySelector('#nexus-video');

        loadBtn.onclick = () => {
            const rawUrl = input.value.trim();
            if(!rawUrl) return;
            // サーバーを介してストリーミング。ここが404ならReplitが止まっている。
            video.src = `${this.serverUrl}/video-stream?url=${encodeURIComponent(rawUrl)}`;
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
            iframe.src = `${this.serverUrl}/proxy?url=${encodeURIComponent(input.value.trim())}`;
        };
        if(initialUrl) goBtn.onclick();
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        this.player.update(this.input.getMovement());
        this.visual.update();
    }
}