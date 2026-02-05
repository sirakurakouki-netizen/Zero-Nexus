import * as THREE from 'three';

export class Player {
    constructor(visualCore) {
        this.visual = visualCore;
        this.mesh = null;

        // 物理パラメータ (KARLSON風の慣性)
        this.position = new THREE.Vector3(0, 1, 0); // 初期位置
        this.velocity = new THREE.Vector3(0, 0, 0); // 現在の速度
        this.acceleration = 1.5;  // 加速の強さ
        this.friction = 0.92;      // 摩擦（1に近いほど滑る）
        this.maxSpeed = 0.3;      // 最大速度

        // カメラ設定
        this.cameraOffset = new THREE.Vector3(0, 3, 6); // 3人称視点の距離
    }

    init() {
        // プレイヤーの仮の姿（ネオンの立方体）
        // 思想：UIに合わせてワイヤーフレーム感を出す
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff, 
            wireframe: true 
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);

        this.visual.scene.add(this.mesh);
    }

    // nexus-masterのtickから毎フレーム呼ばれる
    update(inputVector) {
        if (!this.mesh) return;

        // 1. 入力に基づいた加速計算
        // ジョイスティックのx, yを移動方向に変換
        if (Math.abs(inputVector.x) > 0.1 || Math.abs(inputVector.y) > 0.1) {
            this.velocity.x += inputVector.x * this.acceleration * 0.01;
            this.velocity.z += inputVector.y * this.acceleration * 0.01;
        }

        // 2. 摩擦（慣性）の適用
        this.velocity.x *= this.friction;
        this.velocity.z *= this.friction;

        // 3. 速度制限
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.z ** 2);
        if (speed > this.maxSpeed) {
            const ratio = this.maxSpeed / speed;
            this.velocity.x *= ratio;
            this.velocity.z *= ratio;
        }

        // 4. 位置の更新
        this.position.add(this.velocity);
        this.mesh.position.copy(this.position);

        // 5. 3人称カメラの追従
        this.updateCamera();
    }

    updateCamera() {
        // プレイヤーの後ろにカメラを配置
        const targetCameraPos = new THREE.Vector3(
            this.position.x + this.cameraOffset.x,
            this.position.y + this.cameraOffset.y,
            this.position.z + this.cameraOffset.z
        );

        // 滑らかに追従（Lerp）
        this.visual.camera.position.lerp(targetCameraPos, 0.1);
        this.visual.camera.lookAt(this.position.x, this.position.y + 1, this.position.z);
    }
}