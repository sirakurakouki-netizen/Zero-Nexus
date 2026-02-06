import { CONFIG } from './config.js';
import { VirtualPad } from '../input/virtual-pad.js';
import { WindowManager } from './window-manager.js';

export class NexusMaster {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.vPad = new VirtualPad();
        this.windowManager = new WindowManager();
        this.yaw = 0;
        this.pitch = 0;
    }

    async init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('world-container').appendChild(this.renderer.domElement);
        this.setupWorld();
        this.createPlayer();
        this.vPad.init();
        this.setupUIEvents();
        this.animate();
    }

    setupWorld() {
        const grid = new THREE.GridHelper(100, 50, CONFIG.COLORS.MAIN, 0x001111);
        this.scene.add(grid);
        this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    }

    createPlayer() {
        this.player = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.SUB }));
        body.scale.set(1, 2, 1);
        body.position.y = 1.0; 
        this.player.add(body);
        this.scene.add(this.player);
    }

    setupUIEvents() {
        document.getElementById('menu-btn').onclick = () => {
            const mode = prompt("1: YouTube (URL or ID)\n2: Web Proxy (URL)\n3: Google Search (Proxy)");

            if (mode === "1") {
                const input = prompt("YouTubeのURLまたは動画IDを入力");
                if (input) {
                    let id = input;
                    if (input.includes('v=')) id = input.split('v=')[1].split('&')[0];
                    if (input.includes('be/')) id = input.split('be/')[1].split('?')[0];

                    const embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
                    this.windowManager.createWindow('Nexus Stream', embedUrl);
                }
            } else if (mode === "2") {
                const url = prompt("閲覧したいURL (https://...)");
                if (url) {
                    // プロキシを通さず直接開けるか試す（MDM回避用）
                    this.windowManager.createWindow('Browser', url);
                }
            } else if (mode === "3") {
                const q = prompt("Google検索ワード");
                if (q) {
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}&igu=1`;
                    this.windowManager.createWindow('Search', searchUrl);
                }
            }
        };
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.yaw += (this.vPad.lookInput.x || 0);
        this.pitch -= (this.vPad.lookInput.y || 0);
        this.pitch = Math.max(-Math.PI/2.2, Math.min(Math.PI/2.2, this.pitch));
        this.vPad.lookInput.x = 0; this.vPad.lookInput.y = 0;

        if (this.player) {
            if (this.vPad.active) {
                const moveSpeed = CONFIG.PLAYER.SPEED;
                const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
                const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0,1,0));
                this.player.position.addScaledVector(forward, -this.vPad.input.y * moveSpeed);
                this.player.position.addScaledVector(right, this.vPad.input.x * moveSpeed);
                this.player.rotation.y = this.yaw;
            }
            const camDist = 5;
            this.camera.position.set(
                this.player.position.x + Math.sin(this.yaw) * Math.cos(this.pitch) * camDist,
                this.player.position.y + 2.5 + Math.sin(this.pitch) * camDist,
                this.player.position.z + Math.cos(this.yaw) * Math.cos(this.pitch) * camDist
            );
            this.camera.lookAt(this.player.position.x, this.player.position.y + 1, this.player.position.z);
        }
        this.renderer.render(this.scene, this.camera);
    }
}
window.onload = () => new NexusMaster().init();