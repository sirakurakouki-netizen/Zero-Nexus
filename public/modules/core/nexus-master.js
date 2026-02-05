import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

export class NexusMaster {
    constructor() {
        this.version = "1.4.0-StreamFocus";
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

        // 📺 ストリーミングプレイヤーを起動
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
            <div style="display:flex; flex-direction:column; height:100%; background:#000; color:#0ff;">
                <div style="padding:10px; display:flex; gap:5px; background:#111;">
                    <input type="text" id="yt-url" placeholder="Paste YouTube URL here..." 
                        style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:8px; border-radius:6px; font-size:12px;">
                    <button id="yt-play" style="background:#0ff; color:#000; border:none; padding:0 15px; border-radius:6px; font-weight:bold;">PLAY</button>
                </div>
                <div style="flex-grow:1; display:flex; justify-content:center; align-items:center; position:relative; overflow:hidden;">
                    <video id="nexus-video-player" controls style="width:100%; height:100%; object-fit:contain; display:none;"></video>
                    <div id="loader" style="color:#0ff; font-family:monospace; text-align:center;">
                        <p>Nexus Streaming Engine</p>
                        <p style="font-size:10px; opacity:0.7;">Waiting for Input...</p>
                    </div>
                </div>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Video", playerHtml, { width: 480, height: 320, x: 20, y: 50 });
        const playBtn = win.querySelector('#yt-play');
        const input = win.querySelector('#yt-url');
        const video = win.querySelector('#nexus-video-player');
        const loader = win.querySelector('#loader');

        playBtn.onclick = () => {
            const url = input.value.trim();
            if(!url) return;

            loader.innerHTML = "<p>Analyzing Stream...</p><p style='font-size:10px;'>Fetching data from Replit Server</p>";
            video.style.display = "none";

            // 🚀 サーバーのエンドポイントを叩く
            video.src = `${this.serverUrl}/video-stream?url=${encodeURIComponent(url)}`;

            video.oncanplay = () => {
                loader.style.display = "none";
                video.style.display = "block";
                video.play();
            };

            video.onerror = () => {
                loader.innerHTML = "<p style='color:red;'>Stream Error</p><p style='font-size:10px;'>The server couldn't bypass the restriction.</p>";
            };
        };
    }

    openWebBrowser(initialUrl = "") {
        // ... (前のプロキシブラウザコードと同じ)
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        this.player.update(this.input.getMovement());
        this.visual.update();
    }
}