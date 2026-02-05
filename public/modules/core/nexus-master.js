import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

export class NexusMaster {
    constructor() {
        this.version = "1.3.5-Hybrid";
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

        // 📺 YouTube専用窓（ストリーミングモード）
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
            <div style="display:flex; flex-direction:column; height:100%; background:#000; color:#0ff;">
                <div style="padding:10px; display:flex; gap:5px; background:#111;">
                    <input type="text" id="v-url" placeholder="YouTube URL..." style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:5px; border-radius:4px;">
                    <button id="v-load" style="background:#0ff; color:#000; border:none; padding:0 10px; border-radius:4px; font-weight:bold;">LOAD</button>
                </div>
                <div id="v-container" style="flex-grow:1; display:flex; justify-content:center; align-items:center;">
                    <p id="v-status" style="font-size:12px;">Waiting for Stream...</p>
                    <video id="v-player" controls style="display:none; width:100%; max-height:100%;"></video>
                </div>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Stream (Beta)", playerHtml, { width: 450, height: 350, x: 50, y: 50 });
        const loadBtn = win.querySelector('#v-load');
        const input = win.querySelector('#v-url');
        const video = win.querySelector('#v-player');
        const status = win.querySelector('#v-status');

        loadBtn.onclick = () => {
            const url = input.value.trim();
            if(!url) return;
            status.innerText = "Connecting to Nexus Engine...";
            video.style.display = "none";
            // ★将来的にここにytdl-core経由のURLを流し込む
            status.innerText = "Error: Stream restricted by Google. Need ytdl-core engine update.";
        };
    }

    openWebBrowser(initialUrl = "") {
        const browserHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#111;">
                <div style="padding:10px; display:flex; gap:5px; background:#222;">
                    <input type="text" id="b-url" value="${initialUrl}" style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:8px; border-radius:6px; outline:none;">
                    <button id="b-go" style="background:#0ff; color:#000; border:none; padding:0 15px; border-radius:6px; font-weight:bold;">GO</button>
                </div>
                <iframe id="b-view" src="about:blank" style="flex-grow:1; border:none; background:white;"></iframe>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Browser", browserHtml, { width: 500, height: 400, x: 10, y: 40 });
        const goBtn = win.querySelector('#b-go');
        const input = win.querySelector('#b-url');
        const iframe = win.querySelector('#b-view');

        const load = () => {
            let url = input.value.trim();
            if(!url) return;
            if(!url.includes('.')) url = "https://www.bing.com/search?q=" + encodeURIComponent(url);
            if(!url.startsWith('http')) url = "https://" + url;
            iframe.src = `${this.serverUrl}/proxy?url=${encodeURIComponent(url)}`;
        };

        goBtn.onclick = load;
        input.onkeypress = (e) => { if(e.key === 'Enter') load(); };
        if(initialUrl) load();
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        this.player.update(this.input.getMovement());
        this.visual.update();
    }
}