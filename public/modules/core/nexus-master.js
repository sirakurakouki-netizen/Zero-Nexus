import { VisualCore } from '../world/visual-core.js';
import { VirtualPad } from '../input/virtual-pad.js';

export class NexusMaster {
    constructor() {
        this.version = "1.0.0-Alpha";
        this.visual = new VisualCore();
        this.input = new VirtualPad();
        this.currency = 0;
        this.level = 1;
    }

    boot() {
        console.log(`[Zero-Nexus] Booting Version ${this.version}...`);

        // 3Dエンジンの起動
        this.visual.init();

        // 操作系の起動
        this.input.init();

        // メインループの開始
        this.tick();

        console.log("[Zero-Nexus] System Ready.");
    }

    tick() {
        requestAnimationFrame(() => this.tick());

        // 描画更新
        this.visual.update();

        // 入力情報の反映（慣性計算などはここからplayer.jsへ渡す）
        const movement = this.input.getMovement();
    }

    // 思想：何をしても報酬が入る
    addReward(amount, type = "play") {
        let multiplier = (type === "clear") ? 1.0 : (type === "fail") ? 0.3 : 0.1;
        this.currency += Math.floor(amount * multiplier);
        console.log(`Currency Gained: ${this.currency}`);
    }
}