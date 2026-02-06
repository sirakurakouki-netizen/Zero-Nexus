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
        this.moveSpeed = 0.25;
        this.stickId = null;
        this.lookId = null;
        this.lastX = 0;
        this.lastY = 0;
        this.ytMonitor = null;
    }

    async init() {
        this.mesh = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.5, 1, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0xff00ff })
        );
        this.mesh.position.set(0, 5, 0);
        this.visual.add(this.mesh);

        this.createNeonWorld();
        this.createPermanentStick();
        this.setupMultiTouch();
        this.setupOSUI();

        // 初期ストリーミング映像
        this.updateYoutubeMonitor('jfKfPfyJRdk'); 
    }

    updateYoutubeMonitor(videoId) {
        if (this.ytMonitor) this.visual.cssScene.remove(this.ytMonitor);
        const div = document.createElement('div');
        div.style.width = '800px'; div.style.height = '450px'; div.style.background = '#000';
        // プレイヤーを使わず、可能な限り生データに近い埋め込み
        div.innerHTML = `<iframe width="800" height="450" src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1" frameborder="0" allow="autoplay; encrypted-media" style="width:100%; height:100%;"></iframe>`;

        this.ytMonitor = new CSS3DObject(div);
        this.ytMonitor.position.set(0, 8, -25);
        this.ytMonitor.scale.set(0.02, 0.02, 0.02);
        this.visual.cssScene.add(this.ytMonitor);
    }

    setupMultiTouch() {
        window.addEventListener('touchstart', (e) => {
            for (let t of e.changedTouches) {
                const rect = this.stickBase.getBoundingClientRect();
                const dist = Math.hypot(t.clientX - (rect.left + 65), t.clientY - (rect.top + 65));
                if (dist < 100 && this.stickId === null) {
                    this.stickId = t.identifier;
                } else if (this.lookId === null) { 
                    this.lookId = t.identifier; 
                    this.lastX = t.clientX; this.lastY = t.clientY; 
                }
            }
        }, {passive: false});

        window.addEventListener('touchmove', (e) => {
            for (let t of e.changedTouches) {
                if (t.identifier === this.stickId) {
                    const rect = this.stickBase.getBoundingClientRect();
                    const diff = new THREE.Vector2(t.clientX - (rect.left + 65), t.clientY - (rect.top + 65));
                    const d = Math.min(diff.length(), 60);
                    this.inputVector.set(diff.x/60 * (d/60), -diff.y/60 * (d/60));
                    this.stickThumb.style.transform = `translate(calc(-50% + ${diff.x/Math.max(diff.length(),1)*d}px), calc(-50% + ${diff.y/Math.max(diff.length(),1)*d}px))`;
                } else if (t.identifier === this.lookId) {
                    this.rotY -= (t.clientX - this.lastX) * 0.007;
                    // 視点上下の修正: += で直感的操作
                    this.rotX += (t.clientY - this.lastY) * 0.007; 
                    this.rotX = Math.max(-1.1, Math.min(1.1, this.rotX));
                    this.lastX = t.clientX; this.lastY = t.clientY;
                }
            }
        }, {passive: false});

        window.addEventListener('touchend', (e) => {
            for (let t of e.changedTouches) {
                if (t.identifier === this.stickId) { this.stickId = null; this.inputVector.set(0,0); this.stickThumb.style.transform=`translate(-50%,-50%)`; }
                if (t.identifier === this.lookId) this.lookId = null;
            }
        });
    }

    update() {
        if (!this.mesh) return;

        // 移動計算: 向きを反転修正
        if(this.inputVector.length() > 0) {
            const forward = new THREE.Vector3(Math.sin(this.rotY), 0, Math.cos(this.rotY));
            const right = new THREE.Vector3(Math.sin(this.rotY + Math.PI/2), 0, Math.cos(this.rotY + Math.PI/2));
            const moveDir = forward.multiplyScalar(-this.inputVector.y).add(right.multiplyScalar(this.inputVector.x));
            this.mesh.position.add(moveDir.multiplyScalar(this.moveSpeed));
        }

        this.velocity.y += this.gravity;
        this.mesh.position.y += this.velocity.y;
        if(this.mesh.position.y < 1) { this.mesh.position.y = 1; this.velocity.y = 0; this.isGrounded = true; }

        // カメラ位置 (三人称)
        const dist = 12;
        this.visual.camera.position.set(
            this.mesh.position.x + Math.sin(this.rotY) * Math.cos(this.rotX) * dist,
            this.mesh.position.y + 5.0 + Math.sin(this.rotX) * dist,
            this.mesh.position.z + Math.cos(this.rotY) * Math.cos(this.rotX) * dist
        );

        // ななめ防止の決定打
        this.visual.camera.up.set(0, 1, 0);
        this.visual.camera.lookAt(this.mesh.position.x, this.mesh.position.y + 1.5, this.mesh.position.z);
    }

    setupOSUI() {
        const browser = document.getElementById('proxy-browser');
        const header = document.getElementById('proxy-header');
        const menuBtn = document.getElementById('menu-btn');
        const input = document.getElementById('proxy-input');
        const goBtn = document.getElementById('nav-go');

        // ドラッグ移動ロジック
        let isDragging = false;
        let offset = { x: 0, y: 0 };
        const onStart = (e) => {
            isDragging = true;
            const t = e.touches ? e.touches[0] : e;
            offset.x = t.clientX - browser.offsetLeft;
            offset.y = t.clientY - browser.offsetTop;
        };
        const onMove = (e) => {
            if (!isDragging) return;
            const t = e.touches ? e.touches[0] : e;
            browser.style.left = (t.clientX - offset.x) + 'px';
            browser.style.top = (t.clientY - offset.y) + 'px';
        };
        const onEnd = () => isDragging = false;

        header.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        header.addEventListener('touchstart', onStart);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onEnd);

        menuBtn.onclick = () => browser.classList.toggle('hidden');

        const execute = () => {
            const val = input.value;
            if(val.length < 15) this.updateYoutubeMonitor(val);
            else this.runProxy(val);
        };
        goBtn.onclick = execute;
    }

    runProxy(url) {
        document.getElementById('proxy-status').innerText = "CONNECTING TO PROXY NODE...";
        // ここにプロキシサーバー経由のフェッチを今後追加
    }

    createPermanentStick() {
        const b = document.createElement('div'); b.id="stick-base"; b.style.cssText=`position:fixed; bottom:60px; left:60px; width:130px; height:130px; background:rgba(255,255,255,0.05); border:2px solid #0ff; border-radius:50%; z-index:10005; pointer-events:auto;`;
        const t = document.createElement('div'); t.id="stick-thumb"; t.style.cssText=`position:absolute; top:50%; left:50%; width:60px; height:60px; background:#0ff; border-radius:50%; transform:translate(-50%,-50%); pointer-events:none;`;
        b.appendChild(t); document.body.appendChild(b); this.stickBase = b; this.stickThumb = t;
    }

    createNeonWorld() {
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.MeshStandardMaterial({ color: 0x000000 }));
        floor.rotation.x = -Math.PI / 2;
        this.visual.add(floor);
        const grid = new THREE.GridHelper(1000, 100, 0x00ffff, 0x002222);
        this.visual.add(grid);
    }
}