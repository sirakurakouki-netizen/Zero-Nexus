import { Engine3D } from '../world/engine-3d.js';

class GameMaster {
    constructor() {
        this.container = document.getElementById('game-container');

        // 3Dエンジンの起動
        this.engine3d = new Engine3D(this.container);

        this.init();
    }

    init() {
        console.log("🚀 Zero-Nexus: GameMaster Initiated.");
        this.gameLoop();
    }

    gameLoop() {
        // 毎フレーム実行されるループ
        this.engine3d.update();

        requestAnimationFrame(() => this.gameLoop());
    }
}

// システム起動
window.addEventListener('DOMContentLoaded', () => {
    window.zeroNexus = new GameMaster();
});