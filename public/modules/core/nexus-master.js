import { VisualCore } from '../world/visual-core.js';
import { CameraEngine } from '../world/camera-engine.js';

class NexusMaster {
    constructor() {
        this.visual = new VisualCore();
        this.engine = new CameraEngine(this.visual);
        this.state = {
            mode: 'training',
            isLoggedIn: false,
            credits: 0
        };
    }

    async boot() {
        console.log("Nexus-Master: Initializing Kernel...");
        try {
            await this.visual.init();
            await this.engine.init();

            this.loop();
            console.log("Nexus-Master: System Online.");
        } catch (e) {
            console.error("Kernel Panic:", e);
            document.body.innerHTML = `<div style="color:#f00; padding:20px;">KERNEL ERROR: ${e.message}</div>`;
        }
    }

    loop() {
        this.engine.update();
        this.visual.render();
        requestAnimationFrame(() => this.loop());
    }
}

const nexus = new NexusMaster();
window.onload = () => nexus.boot();