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
        this.history = JSON.parse(localStorage.getItem('nexus_history') || '[]');
    }

    async init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('world-container').appendChild(this.renderer.domElement);
        this.scene.background = new THREE.Color(0x00050a);

        this.setupWorld();
        this.createPlayer();
        this.vPad.init();
        this.setupUIEvents();
        this.checkServer();
        this.animate();
    }

    setupWorld() {
        const grid = new THREE.GridHelper(100, 50, CONFIG.COLORS.MAIN, 0x001111);
        this.scene.add(grid);
        this.scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    }

    createPlayer() {
        this.player = new THREE.Group();
        const body = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshStandardMaterial({ color: CONFIG.COLORS.SUB })
        );
        body.scale.set(1, 2, 1);
        body.position.y = 1.0; 
        this.player.add(body);
        this.scene.add(this.player);
    }

    setupUIEvents() {
        document.getElementById('menu-btn').onclick = () => {
            const mode = prompt(
                "🛡️ Nexus OS Menu\n" +
                "1: YouTube Stream (ID入力)\n" +
                "2: High-Speed Proxy (URL入力)\n" +
                "3: History (履歴表示)\n" +
                "4: Downloader Test", "1"
            );

            if (mode === "1") {
                const ytId = prompt("YouTube Video ID");
                if (ytId) this.windowManager.createWindow('Nexus Stream', `https://www.youtube.com/embed/${ytId}?autoplay=1`);
            } else if (mode === "2") {
                const targetUrl = prompt("閲覧したいURL (https://... )");
                if (targetUrl) {
                    this.saveHistory(targetUrl);
                    const proxyUrl = `${CONFIG.SERVER_URL}/proxy?url=${encodeURIComponent(targetUrl)}`;
                    this.windowManager.createWindow('Nexus Browser', proxyUrl);
                }
            } else if (mode === "3") {
                alert("最近の履歴:\n" + this.history.join("\n"));
            } else if (mode === "4") {
                alert("ダウンローダーは現在サーバー側で構築中です。");
            }
        };
    }

    saveHistory(url) {
        this.history.unshift(url);
        if (this.history.length > 5) this.history.pop();
        localStorage.setItem('nexus_history', JSON.stringify(this.history));
    }

    async checkServer() {
        const lamp = document.getElementById('node-lamp');
        const status = document.getElementById('node-status');
        try {
            const res = await fetch(`${CONFIG.SERVER_URL}/ping`);
            if (res.ok) {
                lamp.style.color = '#00ff00';
                status.innerText = 'ONLINE';
            }
        } catch (e) {
            lamp.style.color = '#ff0000';
            status.innerText = 'OFFLINE';
        }
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