import * as THREE from 'three';

export class VisualCore {
    constructor() {
        this.canvas = document.getElementById('world-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    init() {
        try {
            // レンダラーの作成
            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);

            // シーンとカメラ
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x000000);

            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.set(0, 5, 10);
            this.camera.lookAt(0, 0, 0);

            // 💡 仮の床（これが出れば成功）
            const grid = new THREE.GridHelper(100, 50, 0x00ffff, 0x222222);
            this.scene.add(grid);

            window.addEventListener('resize', () => this.onResize());
            console.log("Visual Engine: WebGL Initialized");
        } catch (e) {
            console.error("Visual System Crash:", e);
            // 致命的なエラーなら、背景を強制的にネオンブルーにして「動いている」ことを示す
            this.canvas.style.background = "radial-gradient(circle, #001122 0%, #000000 100%)";
        }
    }

    onResize() {
        if (!this.camera) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}