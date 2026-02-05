import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

export class NexusMaster {
    constructor() {
        this.version = "1.6.5-Secure-Link";
        // ★重要: GitHackからでも届くように絶対パスを強制
        this.serverUrl = "https://cca3af0f-34bf-4500-a3da-ac5a034fb110-00-3dcqrois903qa.sisko.replit.dev";

        try {
            this.visual = new VisualCore();
            this.input = new VirtualPad();
            this.winManager = new WindowManager();
            this.player = new Player(this.visual);
            console.log("Modules Loaded: Ready for Deployment");
        } catch (e) {
            console.error("Critical Load Error:", e);
        }
    }

    // iOS/Replit間でバグらないための安全なBase64
    st(url) {
        return btoa(encodeURIComponent(url).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
        }));
    }

    boot() {
        if (this.visual) this.visual.init();
        if (this.input) this.input.init();
        if (this.player) this.player.init();
        this.setupOSControls();
        this.tick();
    }

    setupOSControls() {
        const menuBtn = document.getElementById('nexus-menu-btn');
        const drawer = document.getElementById('app-drawer');
        const launchYt = document.getElementById('launch-yt');
        const launchWeb = document.getElementById('launch-browser');

        if (menuBtn && drawer) {
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                drawer.classList.toggle('hidden');
            });
        }

        if (launchYt) launchYt.onclick = () => { drawer.classList.add('hidden'); this.openStealthPlayer(); };
        if (launchWeb) launchWeb.onclick = () => { drawer.classList.add('hidden'); this.openStealthBrowser("https://www.bing.com"); };
    }

    openStealthPlayer() {
        const html = `
            <div style="background:#000; height:100%; display:flex; flex-direction:column; padding:15px;">
                <input id="u" placeholder="YouTube URL..." style="width:100%; background:#111; color:#0ff; border:1px solid #0ff; padding:10px; border-radius:8px;">
                <button id="p" style="width:100%; background:#0ff; color:#000; font-weight:bold; height:45px; margin-top:10px; border-radius:8px; border:none; cursor:pointer;">STREAM DECODE</button>
                <div style="flex-grow:1; display:flex; align-items:center; justify-content:center; margin-top:10px; border:1px dashed #333;">
                    <video id="v" controls playsinline preload="auto" style="width:100%; max-height:100%; display:none;"></video>
                    <p id="msg" style="color:#0ff; font-size:12px;">Waiting for URL...</p>
                </div>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Streamer", html, { width: 400, height: 350, x: 20, y: 50 });
        const video = win.querySelector('#v');
        const btn = win.querySelector('#p');
        const msg = win.querySelector('#msg');

        btn.onclick = () => {
            const url = win.querySelector('#u').value.trim();
            if(!url) return;
            msg.innerText = "Bypassing Google Filters...";

            // 重要：キャッシュをクリアして新規リクエスト
            video.pause();
            video.removeAttribute('src');
            video.load();

            const apiTarget = `${this.serverUrl}/api/v1/stream?d=${this.st(url)}`;
            video.src = apiTarget;
            video.style.display = "block";
            msg.style.display = "none";

            video.play().catch(e => {
                msg.style.display = "block";
                msg.innerText = "iOS Security: Tap Play Button to start.";
            });
        };
    }

    openStealthBrowser(initialUrl) {
        const html = `
            <div style="display:flex; flex-direction:column; height:100%;">
                <div style="background:#111; padding:5px; display:flex; gap:5px;">
                    <input id="url-in" value="${initialUrl}" style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:5px; font-size:12px;">
                    <button id="go-btn" style="background:#0ff; border:none; padding:0 10px;">GO</button>
                </div>
                <iframe id="f" style="flex-grow:1; background:#fff; border:none;"></iframe>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Proxy", html, { width: 450, height: 400, x: 30, y: 70 });
        const iframe = win.querySelector('#f');
        const input = win.querySelector('#url-in');
        const go = win.querySelector('#go-btn');

        const loadUrl = (url) => {
            iframe.src = `${this.serverUrl}/api/v1/fetch?d=${this.st(url)}`;
        };

        go.onclick = () => loadUrl(input.value.trim());
        loadUrl(initialUrl);
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        if (this.player && this.input) this.player.update(this.input.getMovement());
        if (this.visual) this.visual.update();
    }
}