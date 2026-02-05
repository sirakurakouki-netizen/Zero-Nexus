import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { Player } from '../entities/player.js';
import { WindowManager } from '../os/windows.js';

export class NexusMaster {
    constructor() {
        this.version = "1.7.5-Nexus-Protocol";
        // 🛡️ 聖典に基づきReplitのURLを厳格に固定
        this.serverUrl = "https://cca3af0f-34bf-4500-a3da-ac5a034fb110-00-3dcqrois903qa.sisko.replit.dev";

        try {
            this.visual = new VisualCore();
            this.input = new VirtualPad();
            this.winManager = new WindowManager();
            this.player = new Player(this.visual);
            console.log("Nexus OS Booting: All Modules Ready.");
        } catch (e) {
            console.error("Boot Error:", e);
        }
    }

    // 🛡️ iPad/iOSのSafariで記号が化けないためのBase64変換
    st(url) {
        return btoa(encodeURIComponent(url));
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
            <div style="background:#000; height:100%; display:flex; flex-direction:column; padding:15px; border-radius:10px;">
                <input id="u" placeholder="YouTube URL..." style="width:100%; background:#111; color:#0ff; border:1px solid #0ff; padding:12px; border-radius:8px; font-size:16px;">
                <button id="p" style="width:100%; background:#0ff; color:#000; font-weight:bold; height:48px; margin-top:10px; border-radius:8px; border:none;">LOAD DATA</button>
                <div id="v-zone" style="flex-grow:1; display:flex; align-items:center; justify-content:center; margin-top:10px; background:#050505; border:1px solid #222; position:relative;">
                    <video id="v" controls playsinline style="width:100%; height:100%; display:none;"></video>
                    <div id="loader" style="color:#0ff; font-weight:bold; display:none;">DECODING...</div>
                    <div id="info" style="color:#0ff; font-size:12px;">READY</div>
                </div>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Stream", html, { width: 380, height: 350, x: 20, y: 50 });
        const video = win.querySelector('#v');
        const btn = win.querySelector('#p');
        const loader = win.querySelector('#loader');
        const info = win.querySelector('#info');

        btn.onclick = () => {
            const rawUrl = win.querySelector('#u').value.trim();
            if(!rawUrl) return;

            loader.style.display = "block";
            info.style.display = "none";
            video.style.display = "none";

            // iOS Safariのキャッシュをリセット
            video.pause();
            video.removeAttribute("src");
            video.load();

            // リクエスト送信
            const target = `${this.serverUrl}/api/v1/stream?d=${this.st(rawUrl)}`;
            video.src = target;

            video.oncanplay = () => {
                loader.style.display = "none";
                video.style.display = "block";
                video.play().catch(() => {
                    info.style.display = "block";
                    info.innerText = "Tap Video to Play";
                });
            };

            video.onerror = () => {
                loader.style.display = "none";
                info.style.display = "block";
                info.innerText = "NETWORK ERROR: Core Rejected";
            };
        };
    }

    openStealthBrowser(initialUrl) {
        const html = `
            <div style="display:flex; flex-direction:column; height:100%; background:#000;">
                <div style="display:flex; padding:8px; gap:8px; background:#111; border-bottom:1px solid #0ff;">
                    <input id="url-in" value="${initialUrl}" style="flex-grow:1; background:#000; color:#0ff; border:1px solid #0ff; padding:8px; font-size:14px; border-radius:4px;">
                    <button id="go-btn" style="background:#0ff; color:#000; border:none; padding:0 15px; border-radius:4px; font-weight:bold;">GO</button>
                </div>
                <iframe id="f" style="flex-grow:1; border:none; background:#fff;"></iframe>
            </div>
        `;
        const win = this.winManager.createWindow("Nexus Browser", html, { width: 450, height: 400, x: 30, y: 70 });
        const iframe = win.querySelector('#f');
        const input = win.querySelector('#url-in');
        const go = win.querySelector('#go-btn');

        const load = (url) => {
            iframe.src = `${this.serverUrl}/api/v1/fetch?d=${this.st(url)}`;
        };

        go.onclick = () => load(input.value.trim());
        load(initialUrl);
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        if (this.player && this.input) this.player.update(this.input.getMovement());
        if (this.visual) this.visual.update();
    }
}