import * as THREE from 'three';
import { CSS3DRenderer } from 'https://unpkg.com/three@0.160.0/examples/jsm/renderers/CSS3DRenderer.js';

export class VisualCore {
    constructor() {
        this.scene = new THREE.Scene();
        this.cssScene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.cssRenderer = new CSS3DRenderer();
    }

    async init() {
        // CSS3D レイヤー (最背面にして、WebGLを透明に重ねる)
        this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
        this.cssRenderer.domElement.style.position = 'absolute';
        this.cssRenderer.domElement.style.top = '0';
        this.cssRenderer.domElement.style.zIndex = '0'; // ここを0に
        document.body.appendChild(this.cssRenderer.domElement);

        // WebGL レイヤー
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0); // 背景を透明にする
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.zIndex = '1'; 
        this.renderer.domElement.style.pointerEvents = 'none'; // 3D部分以外をスルーしてYouTubeを触れるように
        document.body.appendChild(this.renderer.domElement);

        this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    }

    add(obj) { this.scene.add(obj); }
    render() {
        this.renderer.render(this.scene, this.camera);
        this.cssRenderer.render(this.cssScene, this.camera);
    }
}