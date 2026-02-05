import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

export class NexusMaster {
    constructor() {
        this.version = "1.0.9-Alpha";
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
        const menuBtn = document.getElementById('nexus-menu-btn');
        const appDrawer = document.getElementById('app-drawer');

        if (menuBtn) {
            menuBtn.onclick = (e) => {
                e.stopPropagation();
                appDrawer.classList.toggle('hidden');
            };
        }

        // 🚀 YouTubeを「モバイルサイトモード」で起動
        const ytBtn = document.getElementById('launch-yt');
        if (ytBtn) {
            ytBtn.onclick = () => {
                appDrawer.classList.add('hidden');
                // playerを使わず、m.youtube.com（モバイル版）を直接呼ぶ
                this.openWebBrowser("https://m.youtube.com");
            };
        }

        const browserBtn = document.getElementById('launch-browser');
        if (browserBtn) {
            browserBtn.onclick = () => {
                appDrawer.classList.add('hidden');
                this.openWebBrowser("https://www.bing.com");
            };
        }
    }

    openWebBrowser(initialUrl = "https://www.bing.com") {
        const browserHtml = `
            <div style="display:flex; flex-direction:column; height:100%; background:#000;">
                <div style="padding:8px; display:flex; gap:5px; background:#111; border-bottom:1px solid #0ff;">
                    <input type="text" id="browser-url" value="${initialUrl}" 
                        style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:5px; border-radius:4px; font-size:12px;">
                    <button id="browser-go" style="background:#0ff; color:#000; border:none; padding:0 12px; border-radius:4px; font-weight:bold;">GO</button>
                </div>
                <iframe id="browser-viewport" src="${initialUrl}" 
                    style="flex-grow:1; border:none; background:white;"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                </iframe>
            </div>
        `;

        const win = this.winManager.createWindow("Nexus Web Explorer", browserHtml, { width: 480, height: 380, x: 20, y: 50 });
        const goBtn = win.querySelector('#browser-go');
        const input = win.querySelector('#browser-url');
        const iframe = win.querySelector('#browser-viewport');

        goBtn.onclick = () => {
            let val = input.value.trim();
            if(!val) return;
            if(!val.startsWith('http')) val = 'https://' + val;
            iframe.src = val; // 直接URLを指定（プロキシを通さない方がYouTubeは動く可能性がある）
        };

        input.onkeypress = (e) => { if(e.key === 'Enter') goBtn.onclick(); };
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        this.player.update(this.input.getMovement());
        this.visual.update();
    }
}