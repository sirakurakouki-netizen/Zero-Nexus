import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

export class NexusMaster {
    constructor() {
        this.version = "1.4.1-Fixed";
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
            this.openNexusPlayer();
        };

        document.getElementById('launch-browser').onclick = () => {
            appDrawer.classList.add('hidden');
            this.openWebBrowser("https://www.bing.com");
        };
    }

    openNexusPlayer() {
        const playerHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#000; color:#0ff; font-family:monospace;">
                <div style="padding:10px; display:flex; gap:5px; background:#111;">
                    <input type="text" id="yt-url" placeholder="Paste YouTube Link..." 
                        style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:8px; border-radius:6px;">
                    <button id="yt-play" style="background:#0ff; color:#000; border:none; padding:0 15px; border-radius:6px; font-weight:bold;">PLAY</button>
                </div>
                <div id="v-display" style="flex-grow:1; display:flex; justify-content:center; align-items:center; background:#000; position:relative;">
                    <div id="v-loader" style="text-align:center;">
                        <p id="v-msg">Nexus Video Ready</p>
                    </div>
                    <video id="v-player" controls playsinline style="display:none; width:100%; height:100%;"></video>
                </div>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Video", playerHtml, { width: 480, height: 320, x: 20, y: 50 });
        const playBtn = win.querySelector('#yt-play');
        const input = win.querySelector('#yt-url');
        const video = win.querySelector('#v-player');
        const msg = win.querySelector('#v-msg');

        playBtn.onclick = () => {
            const url = input.value.trim();
            if(!url) return;

            msg.innerText = "Connecting to Server...";
            video.style.display = "none";

            // 重要：キャッシュを避けるためにタイムスタンプを付与
            video.src = `${this.serverUrl}/video-stream?url=${encodeURIComponent(url)}&t=${Date.now()}`;
            video.load();

            video.onplaying = () => {
                msg.style.display = "none";
                video.style.display = "block";
            };

            video.onerror = (e) => {
                msg.innerText = "Stream Error: Server Blocked.";
                console.error("Video Error", video.error);
            };
        };
    }

    openWebBrowser(initialUrl = "") {
        const browserHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#111;">
                <div style="padding:10px; display:flex; gap:5px; background:#222;">
                    <input type="text" id="b-url" value="${initialUrl}" style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:8px; border-radius:6px;">
                    <button id="b-go" style="background:#0ff; color:#000; border:none; padding:0 15px; border-radius:6px; font-weight:bold;">GO</button>
                </div>
                <iframe id="b-view" style="flex-grow:1; border:none; background:white;"></iframe>
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
        if(initialUrl) load();
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        this.player.update(this.input.getMovement());
        this.visual.update();
    }
}