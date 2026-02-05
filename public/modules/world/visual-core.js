import * as THREE from 'three';
import { GridSystem } from './grid-system.js';

export class VisualCore {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.grid = new GridSystem();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // ネオンが映える漆黒の世界
        this.renderer.setClearColor(0x000000, 1);
        document.getElementById('game-canvas-container').appendChild(this.renderer.domElement);

        // カメラの初期位置 (3人称視点の準備)
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 0, 0);

        // グリッド（床）の追加
        this.grid.addToScene(this.scene);

        // 環境光
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        window.addEventListener('resize', () => this.onWindowResize());
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        this.grid.update();
        this.renderer.render(this.scene, this.camera);
    }
}