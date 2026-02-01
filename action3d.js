function init3D() {
    const canvas = document.getElementById('gameCanvas');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // 完全に真っ黒ではなく濃いグレー
    scene.fog = new THREE.FogExp2(0x111111, 0.02); // 距離感を出す霧

    // カメラ設定
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // 画面を綺麗に

    // --- 照明 (ここがないと真っ暗になる) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // 全体的な明るさ
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); // 太陽光
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // --- 地面 ---
    const gridHelper = new THREE.GridHelper(200, 50, 0x00f2ff, 0x333333);
    scene.add(gridHelper);

    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshBasicMaterial({ color: 0x050505, side: THREE.DoubleSide });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // --- プレイヤー ---
    const playerGroup = new THREE.Group();
    const bodyGeo = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00f2ff, emissive: 0x001133 });
    const playerBody = new THREE.Mesh(bodyGeo, bodyMat);
    playerBody.position.y = 1;
    playerGroup.add(playerBody);
    scene.add(playerGroup);

    // --- 敵キャラクター生成 ---
    let enemies = [];
    function spawnEnemy() {
        const geo = new THREE.BoxGeometry(1, 2, 1);
        const mat = new THREE.MeshStandardMaterial({ color: 0xff0055 });
        const enemy = new THREE.Mesh(geo, mat);
        enemy.position.set(Math.random()*40 - 20, 1, Math.random()*40 - 20);
        enemy.hp = 3;
        scene.add(enemy);
        enemies.push(enemy);
    }
    // 初期敵を5体配置
    for(let i=0; i<5; i++) spawnEnemy();

    // 弾丸管理
    let bullets = [];

    // --- ゲームループ変数 ---
    let rotY = 0; // プレイヤーの向き
    let velocityY = 0; // ジャンプ用

    function animate() {
        if (!window.gameState.isPlaying) return; // メニュー画面なら止める
        requestAnimationFrame(animate);

        const input = window.gameState.input;

        // 1. 視点回転
        rotY -= input.lookX;
        playerGroup.rotation.y = rotY;

        // 2. 移動計算
        const speed = 0.15;
        // 入力(XY)を、プレイヤーの向き(rotY)に合わせて変換
        const forward = input.moveY; 
        const side = input.moveX;

        // 三角関数で進行方向を計算
        playerGroup.position.x += (Math.sin(rotY) * forward - Math.cos(rotY) * side) * speed;
        playerGroup.position.z += (Math.cos(rotY) * forward + Math.sin(rotY) * side) * speed;

        // 3. ジャンプ & 重力
        if (input.isJumping && playerGroup.position.y <= 1.01) {
            velocityY = 0.25; // ジャンプ力
        }
        playerGroup.position.y += velocityY;

        // 接地判定
        if (playerGroup.position.y > 1) {
            velocityY -= 0.015; // 重力
        } else {
            playerGroup.position.y = 1;
            velocityY = 0;
        }

        // 4. カメラ追従 (TPS視点)
        const camDist = 6;
        const camHeight = 4;
        camera.position.x = playerGroup.position.x - Math.sin(rotY) * camDist;
        camera.position.z = playerGroup.position.z - Math.cos(rotY) * camDist;
        camera.position.y = playerGroup.position.y + camHeight;
        camera.lookAt(playerGroup.position);

        // 5. 攻撃処理
        if (input.isFiring) {
            input.isFiring = false; // 連射防止（タップごとに1発）

            const bullet = new THREE.Mesh(
                new THREE.SphereGeometry(0.2), 
                new THREE.MeshBasicMaterial({ color: 0xffff00 })
            );
            bullet.position.copy(playerGroup.position);
            bullet.position.y += 1; // 胸の高さから発射

            // プレイヤーの向いている方向に飛ばす
            bullet.velocity = new THREE.Vector3(Math.sin(rotY), 0, Math.cos(rotY)).multiplyScalar(0.5);
            bullet.life = 60; // 60フレームで消える
            scene.add(bullet);
            bullets.push(bullet);
        }

        // 6. 弾の移動と衝突判定
        for (let i = bullets.length - 1; i >= 0; i--) {
            let b = bullets[i];
            b.position.add(b.velocity);
            b.life--;

            // 敵との衝突
            for (let j = enemies.length - 1; j >= 0; j--) {
                let e = enemies[j];
                if (b.position.distanceTo(e.position) < 1.5) {
                    // 命中！
                    e.hp--;
                    scene.remove(b);
                    bullets.splice(i, 1);

                    // 敵撃破
                    if (e.hp <= 0) {
                        scene.remove(e);
                        enemies.splice(j, 1);
                        window.gameState.money += 100; // 報酬
                        updateUI(); // 表示更新
                        saveData(); // セーブ
                        spawnEnemy(); // 新しい敵補充
                    }
                    break;
                }
            }

            if (b.life <= 0) {
                scene.remove(b);
                bullets.splice(i, 1);
            }
        }

        renderer.render(scene, camera);
    }

    animate();

    // 画面リサイズ対応
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
