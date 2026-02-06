import * as THREE from 'three';
import { CSS3DRenderer } from 'https://unpkg.com/three@0.160.0/examples/jsm/renderers/CSS3DRenderer.js';

export class VisualCore {
    constructor() {
        this.scene = new THREE.Scene();
        this.cssScene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.cssRenderer = new CSS3DRenderer();
    }

    async init() {
        // 1. CSS3D (YouTube用レイヤー)
        this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
        this.cssRenderer.domElement.style.position = 'absolute';
        this.cssRenderer.domElement.style.top = '0';
        this.cssRenderer.domElement.style.zIndex = '0'; // 背景側
        document.body.appendChild(this.cssRenderer.domElement);

        // 2. WebGL (ゲーム用レイヤー)
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0); // 透明にしてCSS3Dを見せる
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.zIndex = '1'; // 前面側
        this.renderer.domElement.style.pointerEvents = 'none'; // クリックを下のYouTubeに通す
        document.body.appendChild(this.renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambient);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    add(obj) { this.scene.add(obj); }
    render() {
        this.renderer.render(this.scene, this.camera);
        this.cssRenderer.render(this.cssScene, this.camera);
    }
}