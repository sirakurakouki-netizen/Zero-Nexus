/**
 * PROJECT ∞ - 3D ENGINE
 * 3D空間の描写、物理演算、プレイヤーの基本アクション
 */

export const Engine3D = {
    scene: null,
    camera: null,
    renderer: null,
    player: null,
    moveState: { forward: 0, right: 0, isDashing: false, isSliding: false },

    init: function() {
        // 1. シーン・カメラ・ライトの基本設定
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000008); // 深い紺色（宇宙・ネオン風）

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
        this.scene.add(light);

        // 2. プレイヤー（簡易的なワイヤーフレーム・カプセル）
        const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
        this.player = new THREE.Mesh(geometry, material);
        this.player.position.y = 1;
        this.scene.add(this.player);

        // 3. 地面（グリッド）
        const grid = new THREE.GridHelper(100, 50, 0x00ffff, 0x222222);
        this.scene.add(grid);

        this.camera.position.set(0, 2, 5);

        this.animate();
        console.log("3Dエンジン起動完了");
    },

    // アクション：スライディング (仕様書1-1)
    performSliding: function() {
        if (this.moveState.isDashing && !this.moveState.isSliding) {
            this.moveState.isSliding = true;
            this.player.scale.y = 0.5; // 体勢を低くする

            // 1秒後に解除
            setTimeout(() => {
                this.player.scale.y = 1.0;
                this.moveState.isSliding = false;
            }, 800);
        }
    },

    // アクション：ジャンプ
    performJump: function() {
        if (this.player.position.y <= 1.01) { // 地面にいる時だけ
            const jumpHeight = 1.5;
            new TWEEN.Tween(this.player.position)
                .to({ y: this.player.position.y + jumpHeight }, 300)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    new TWEEN.Tween(this.player.position)
                        .to({ y: 1 }, 300)
                        .easing(TWEEN.Easing.Quadratic.In)
                        .start();
                })
                .start();
        }
    },

    animate: function() {
        requestAnimationFrame(() => this.animate());
        TWEEN.update();

        // 簡易的な移動ロジック（実際の入力連携はmain.js等で行う）
        if (this.player) {
            // カメラをプレイヤーに追従させる
            this.camera.position.lerp(
                new THREE.Vector3(this.player.position.x, this.player.position.y + 2, this.player.position.z + 5), 
                0.1
            );
            this.camera.lookAt(this.player.position);
        }

        this.renderer.render(this.scene, this.camera);
    }
};

// 起動時に初期化
Engine3D.init();