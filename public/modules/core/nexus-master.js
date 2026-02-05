import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

export class NexusMaster {
    constructor() {
        this.version = "1.3.1-Beta";
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

        // 📺 YouTubeを「プロキシ経由のブラウザ窓」で開くように変更
        document.getElementById('launch-yt').onclick = () => {
            appDrawer.classList.add('hidden');
            this.openWebBrowser("https://m.youtube.com");
        };

        document.getElementById('launch-browser').onclick = () => {
            appDrawer.classList.add('hidden');
            this.openWebBrowser("https://www.bing.com");
        };
    }

    openWebBrowser(initialUrl = "") {
        const browserHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#111;">
                <div style="padding:10px; display:flex; gap:5px; background:#222;">
                    <input type="text" id="browser-url" value="${initialUrl}" style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:8px; border-radius:6px; outline:none;">
                    <button id="browser-go" style="background:#0ff; color:#000; border:none; padding:0 15px; border-radius:6px; font-weight:bold;">GO</button>
                </div>
                <iframe id="browser-viewport" src="about:blank" style="flex-grow:1; border:none; background:white;"></iframe>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Browser", browserHtml, { width: 500, height: 400, x: 10, y: 40 });
        const goBtn = win.querySelector('#browser-go');
        const input = win.querySelector('#browser-url');
        const iframe = win.querySelector('#browser-viewport');

        const load = () => {
            let url = input.value.trim();
            if(!url) return;
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