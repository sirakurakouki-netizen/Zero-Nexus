import { VirtualPad } from '../input/virtual-pad.js';
import { CombatUI } from '../nexus-apps/combat-ui.js';

export class NexusMaster {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.vPad = new VirtualPad();
        this.combat = new CombatUI(this);

        this.velocity = new THREE.Vector3();
        this.yaw = 0;   
        this.pitch = 0; 
        this.isJumping = false;
        this.isAttacking = false;
        this.isGuarding = false;
    }

    async init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.scene.background = new THREE.Color(0x000810);

        this.scene.add(new THREE.GridHelper(100, 50, 0x00ffff, 0x002222));
        this.scene.add(new THREE.AmbientLight(0xffffff, 1.0));

        this.createPlayer();
        this.vPad.init();
        this.combat.init();
        this.animate();
    }

    createPlayer() {
        this.player = new THREE.Group();

        // 胴体
        const body = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xff00ff })
        );
        body.scale.set(1, 2, 1);
        body.position.y = 1.0; 
        this.player.add(body);

        // 武器（ネオン・ソード）
        this.swordGroup = new THREE.Group();
        const swordGeo = new THREE.BoxGeometry(0.1, 1.5, 0.1);
        const swordMat = new THREE.MeshStandardMaterial({ 
            color: 0x00ffff, 
            emissive: 0x00ffff, 
            emissiveIntensity: 2 
        });
        this.sword = new THREE.Mesh(swordGeo, swordMat);
        this.sword.position.set(0.7, 1.2, 0.5); // 右手付近に配置
        this.swordGroup.add(this.sword);
        this.player.add(this.swordGroup);

        this.scene.add(this.player);
    }

    // --- アクション関数（CombatUIからのエラーを解消） ---
    attack() {
        if (this.isAttacking) return;
        this.isAttacking = true;
        // 簡易的な振り下ろしアニメーション
        const originalRotation = this.sword.rotation.x;
        this.sword.rotation.x -= 1.5;
        setTimeout(() => {
            this.sword.rotation.x = originalRotation;
            this.isAttacking = false;
        }, 200);
    }

    guard(state) {
        this.isGuarding = state;
        if (state) {
            this.sword.position.set(0, 1.2, 0.8); // 前に構える
            this.sword.rotation.z = Math.PI / 2;
        } else {
            this.sword.position.set(0.7, 1.2, 0.5); // 元に戻す
            this.sword.rotation.z = 0;
        }
    }

    jump() { 
        if (!this.isJumping) { 
            this.velocity.y = 0.2; 
            this.isJumping = true; 
        } 
    }

    slide() {
        this.player.scale.y = 0.5;
        setTimeout(() => { this.player.scale.y = 1.0; }, 500);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 視点
        this.yaw -= (this.vPad.lookInput.x || 0) * 2.0;
        this.pitch -= (this.vPad.lookInput.y || 0) * 2.0;
        this.pitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.pitch));

        this.vPad.lookInput.x = 0;
        this.vPad.lookInput.y = 0;

        if (this.player) {
            if (this.vPad.active) {
                const moveSpeed = this.isGuarding ? 0.05 : 0.15;
                // 移動方向の修正：入力をカメラの向きに合わせて正転
                const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
                const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0), forward);

                // input.yとxの計算を反転させて正しい方向へ
                this.player.position.addScaledVector(forward, -this.vPad.input.y * moveSpeed);
                this.player.position.addScaledVector(right, this.vPad.input.x * moveSpeed);

                this.player.rotation.y = this.yaw;
            }

            // 重力
            this.player.position.y += this.velocity.y;
            if (this.player.position.y > 0) {
                this.velocity.y -= 0.01;
            } else {
                this.player.position.y = 0;
                this.velocity.y = 0;
                this.isJumping = false;
            }

            // 三人称視点カメラ
            const camDist = 6;
            const horizontalDist = camDist * Math.cos(this.pitch);
            const verticalDist = camDist * Math.sin(this.pitch);

            this.camera.position.set(
                this.player.position.x + Math.sin(this.yaw) * horizontalDist,
                this.player.position.y + 2.5 + verticalDist,
                this.player.position.z + Math.cos(this.yaw) * horizontalDist
            );
            this.camera.lookAt(new THREE.Vector3(this.player.position.x, this.player.position.y + 1, this.player.position.z));
        }

        this.renderer.render(this.scene, this.camera);
    }
}
window.onload = () => new NexusMaster().init();import { VirtualPad } from '../input/virtual-pad.js';
import { CombatUI } from '../nexus-apps/combat-ui.js';

export class NexusMaster {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.vPad = new VirtualPad();
        this.combat = new CombatUI(this);

        this.velocity = new THREE.Vector3();
        this.yaw = 0;   
        this.pitch = 0; 
        this.isJumping = false;
        this.isAttacking = false;
        this.isGuarding = false;
    }

    async init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.scene.background = new THREE.Color(0x000810);

        this.scene.add(new THREE.GridHelper(100, 50, 0x00ffff, 0x002222));
        this.scene.add(new THREE.AmbientLight(0xffffff, 1.0));

        this.createPlayer();
        this.vPad.init();
        this.combat.init();
        this.animate();
    }

    createPlayer() {
        this.player = new THREE.Group();

        // 胴体
        const body = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xff00ff })
        );
        body.scale.set(1, 2, 1);
        body.position.y = 1.0; 
        this.player.add(body);

        // 武器（ネオン・ソード）
        this.swordGroup = new THREE.Group();
        const swordGeo = new THREE.BoxGeometry(0.1, 1.5, 0.1);
        const swordMat = new THREE.MeshStandardMaterial({ 
            color: 0x00ffff, 
            emissive: 0x00ffff, 
            emissiveIntensity: 2 
        });
        this.sword = new THREE.Mesh(swordGeo, swordMat);
        this.sword.position.set(0.7, 1.2, 0.5); // 右手付近に配置
        this.swordGroup.add(this.sword);
        this.player.add(this.swordGroup);

        this.scene.add(this.player);
    }

    // --- アクション関数（CombatUIからのエラーを解消） ---
    attack() {
        if (this.isAttacking) return;
        this.isAttacking = true;
        // 簡易的な振り下ろしアニメーション
        const originalRotation = this.sword.rotation.x;
        this.sword.rotation.x -= 1.5;
        setTimeout(() => {
            this.sword.rotation.x = originalRotation;
            this.isAttacking = false;
        }, 200);
    }

    guard(state) {
        this.isGuarding = state;
        if (state) {
            this.sword.position.set(0, 1.2, 0.8); // 前に構える
            this.sword.rotation.z = Math.PI / 2;
        } else {
            this.sword.position.set(0.7, 1.2, 0.5); // 元に戻す
            this.sword.rotation.z = 0;
        }
    }

    jump() { 
        if (!this.isJumping) { 
            this.velocity.y = 0.2; 
            this.isJumping = true; 
        } 
    }

    slide() {
        this.player.scale.y = 0.5;
        setTimeout(() => { this.player.scale.y = 1.0; }, 500);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 視点
        this.yaw -= (this.vPad.lookInput.x || 0) * 2.0;
        this.pitch -= (this.vPad.lookInput.y || 0) * 2.0;
        this.pitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, this.pitch));

        this.vPad.lookInput.x = 0;
        this.vPad.lookInput.y = 0;

        if (this.player) {
            if (this.vPad.active) {
                const moveSpeed = this.isGuarding ? 0.05 : 0.15;
                // 移動方向の修正：入力をカメラの向きに合わせて正転
                const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
                const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0), forward);

                // input.yとxの計算を反転させて正しい方向へ
                this.player.position.addScaledVector(forward, -this.vPad.input.y * moveSpeed);
                this.player.position.addScaledVector(right, this.vPad.input.x * moveSpeed);

                this.player.rotation.y = this.yaw;
            }

            // 重力
            this.player.position.y += this.velocity.y;
            if (this.player.position.y > 0) {
                this.velocity.y -= 0.01;
            } else {
                this.player.position.y = 0;
                this.velocity.y = 0;
                this.isJumping = false;
            }

            // 三人称視点カメラ
            const camDist = 6;
            const horizontalDist = camDist * Math.cos(this.pitch);
            const verticalDist = camDist * Math.sin(this.pitch);

            this.camera.position.set(
                this.player.position.x + Math.sin(this.yaw) * horizontalDist,
                this.player.position.y + 2.5 + verticalDist,
                this.player.position.z + Math.cos(this.yaw) * horizontalDist
            );
            this.camera.lookAt(new THREE.Vector3(this.player.position.x, this.player.position.y + 1, this.player.position.z));
        }

        this.renderer.render(this.scene, this.camera);
    }
}
window.onload = () => new NexusMaster().init();