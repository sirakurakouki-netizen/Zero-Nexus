import * as THREE from 'three';
import { CSS3DObject } from 'https://unpkg.com/three@0.160.0/examples/jsm/renderers/CSS3DRenderer.js';

export class CameraEngine {
    constructor(visual) {
        this.visual = visual;
        this.mesh = null;
        this.rotX = 0;
        this.rotY = 0;
        this.inputVector = new THREE.Vector2(0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.isGrounded = false;
        this.gravity = -0.015;
        this.moveSpeed = 0.22;
        this.stickId = null;
        this.lookId = null;
        this.ytMonitor = null;
    }

    async init() {
        // プレイヤー
        this.mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1, 4, 8), new THREE.MeshStandardMaterial({ color: 0xff00ff }));
        this.mesh.position.set(0, 2, 0);
        this.visual.add(this.mesh);

        this.createNeonWorld();
        this.createPermanentStick();
        this.setupMultiTouch();
        this.setupOSUI(); // 2Dウィンドウ連携

        // 初期のテストモニター
        this.updateYoutubeMonitor('fCJ465Da4S4');
    }

    setupOSUI() {
        const menuBtn = document.getElementById('menu-btn');
        const win = document.getElementById('nexus-window');
        const closeBtn = document.getElementById('close-btn');
        const playBtn = document.getElementById('yt-play-btn');
        const ytInput = document.getElementById('yt-url');

        menuBtn.onclick = () => win.classList.toggle('hidden');
        closeBtn.onclick = () => win.classList.add('hidden');

        playBtn.onclick = () => {
            let val = ytInput.value;
            let id = val.includes('v=') ? val.split('v=')[1].split('&')[0] : val;
            this.updateYoutubeMonitor(id);
            win.classList.add('hidden');
        };
    }

    updateYoutubeMonitor(videoId) {
        if (this.ytMonitor) {
            this.visual.cssScene.remove(this.ytMonitor);
        }
        const div = document.createElement('div');
        div.style.width = '640px'; div.style.height = '360px'; div.style.background = '#000';
        div.innerHTML = `<iframe width="640" height="360" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay"></iframe>`;

        this.ytMonitor = new CSS3DObject(div);
        this.ytMonitor.position.set(0, 6, -15);
        this.ytMonitor.scale.set(0.015, 0.015, 0.015);
        this.visual.cssScene.add(this.ytMonitor);
    }

    createNeonWorld() {
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshStandardMaterial({ color: 0x000000 }));
        floor.rotation.x = -Math.PI / 2; this.visual.add(floor);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        for (let i = -500; i <= 500; i += 10) {
            const row = new THREE.Mesh(new THREE.PlaneGeometry(1000, 0.3), lineMat);
            row.rotation.x = -Math.PI / 2; row.position.set(0, 0.01, i); this.visual.add(row);
            const col = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 1000), lineMat);
            col.rotation.x = -Math.PI / 2; col.position.set(i, 0.01, 0); this.visual.add(col);
        }
    }

    setupMultiTouch() {
        let lastX = 0, lastY = 0;
        window.addEventListener('touchstart', (e) => {
            for (let t of e.changedTouches) {
                const rect = this.stickBase.getBoundingClientRect();
                const dist = Math.hypot(t.clientX - (rect.left + 65), t.clientY - (rect.top + 65));
                if (dist < 80 && this.stickId === null) { this.stickId = t.identifier; }
                else if (this.lookId === null) { this.lookId = t.identifier; lastX = t.clientX; lastY = t.clientY; }
            }
        });
        window.addEventListener('touchmove', (e) => {
            for (let t of e.changedTouches) {
                if (t.identifier === this.stickId) {
                    const rect = this.stickBase.getBoundingClientRect();
                    const diff = new THREE.Vector2(t.clientX - (rect.left + 65), t.clientY - (rect.top + 65));
                    const d = Math.min(diff.length(), 60);
                    this.inputVector.set(diff.x/60 * (d/60), -diff.y/60 * (d/60));
                    this.stickThumb.style.transform = `translate(calc(-50% + ${diff.x/diff.length()*d}px), calc(-50% + ${diff.y/diff.length()*d}px))`;
                } else if (t.identifier === this.lookId) {
                    this.rotY -= (t.clientX - lastX) * 0.007;
                    this.rotX -= (t.clientY - lastY) * 0.007; // 修正済
                    this.rotX = Math.max(-1.2, Math.min(1.2, this.rotX));
                    lastX = t.clientX; lastY = t.clientY;
                }
            }
        });
        window.addEventListener('touchend', (e) => {
            for (let t of e.changedTouches) {
                if (t.identifier === this.stickId) { this.stickId = null; this.inputVector.set(0,0); this.stickThumb.style.transform=`translate(-50%,-50%)`; }
                if (t.identifier === this.lookId) this.lookId = null;
            }
        });
    }

    update() {
        if (!this.mesh) return;
        this.velocity.y += this.gravity;
        if(this.inputVector.length() > 0) {
            const forward = new THREE.Vector3(Math.sin(this.rotY), 0, Math.cos(this.rotY));
            const right = new THREE.Vector3(Math.sin(this.rotY + Math.PI/2), 0, Math.cos(this.rotY + Math.PI/2));
            this.mesh.position.add(forward.multiplyScalar(-this.inputVector.y).add(right.multiplyScalar(this.inputVector.x)).multiplyScalar(this.moveSpeed));
        }
        this.mesh.position.y += this.velocity.y;
        if(this.mesh.position.y < 1) { this.mesh.position.y = 1; this.velocity.y = 0; this.isGrounded = true; }

        // カメラ更新
        const d = 9;
        this.visual.camera.position.set(
            this.mesh.position.x + Math.sin(this.rotY) * Math.cos(this.rotX) * d,
            this.mesh.position.y + 3.5 + Math.sin(this.rotX) * d,
            this.mesh.position.z + Math.cos(this.rotY) * Math.cos(this.rotX) * d
        );
        this.visual.camera.lookAt(this.mesh.position.x, this.mesh.position.y + 1.5, this.mesh.position.z);

        // ★ 強力な水平ロック: オイラー角を直接書き換え
        this.visual.camera.rotation.z = 0;
        this.visual.camera.quaternion.setFromEuler(this.visual.camera.rotation);
    }

    createPermanentStick() {
        const b = document.createElement('div'); b.id="stick-base"; b.style.cssText=`position:fixed; bottom:60px; left:60px; width:130px; height:130px; background:rgba(0,255,255,0.1); border:3px solid #0ff; border-radius:50%; z-index:10005; pointer-events:auto;`;
        const t = document.createElement('div'); t.id="stick-thumb"; t.style.cssText=`position:absolute; top:50%; left:50%; width:60px; height:60px; background:#0ff; border-radius:50%; transform:translate(-50%,-50%); pointer-events:none;`;
        b.appendChild(t); document.body.appendChild(b); this.stickBase = b; this.stickThumb = t;
    }
}