// グローバル変数（どこからでもアクセス可能にする）
window.gameState = {
    isPlaying: false,
    money: 0,
    hp: 100,
    input: {
        moveX: 0,
        moveY: 0,
        lookX: 0,
        lookY: 0,
        isFiring: false,
        isJumping: false
    }
};

// セーブデータの読み込み
function loadData() {
    const data = localStorage.getItem('project_inf_save');
    if (data) {
        const parsed = JSON.parse(data);
        window.gameState.money = parsed.money || 0;
        updateUI();
    }
}

function saveData() {
    const data = { money: window.gameState.money };
    localStorage.setItem('project_inf_save', JSON.stringify(data));
}

function clearSave() {
    localStorage.clear();
    location.reload();
}

function updateUI() {
    document.getElementById('ui-money').innerText = "CORE: " + window.gameState.money;
    document.getElementById('ui-hp').innerText = "HP: " + window.gameState.hp + "%";
}

// ゲーム開始処理
function startGame() {
    window.gameState.isPlaying = true;
    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('game-hud').style.display = 'block';

    // 3D初期化 (action3d.jsの関数)
    if (typeof init3D === 'function') {
        init3D();
    }
}

function exitGame() {
    location.reload();
}

// ==========================================
// コントローラー制御システム (タッチ対応)
// ==========================================
window.onload = function() {
    loadData();

    // --- 左スティック (移動) ---
    const stickLeft = document.getElementById('stick-left');
    const knobLeft = document.getElementById('knob-left');

    stickLeft.addEventListener('touchmove', function(e) {
        e.preventDefault(); // スクロール防止
        const touch = e.touches[0];
        const rect = stickLeft.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;

        // 距離制限 (スティックが枠からはみ出ないように)
        const distance = Math.min(Math.sqrt(dx*dx + dy*dy), 40);
        const angle = Math.atan2(dy, dx);

        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;

        knobLeft.style.transform = `translate(${moveX}px, ${moveY}px)`;

        // ゲームへの入力値 (-1.0 〜 1.0)
        window.gameState.input.moveX = moveX / 40;
        window.gameState.input.moveY = moveY / 40;
    });

    stickLeft.addEventListener('touchend', function() {
        knobLeft.style.transform = `translate(0px, 0px)`;
        window.gameState.input.moveX = 0;
        window.gameState.input.moveY = 0;
    });

    // --- 右ゾーン (視点操作) ---
    const lookZone = document.getElementById('touch-look-zone');
    let lastX = 0;

    lookZone.addEventListener('touchstart', (e) => { lastX = e.touches[0].clientX; });
    lookZone.addEventListener('touchmove', (e) => {
        const currentX = e.touches[0].clientX;
        const diff = currentX - lastX;
        window.gameState.input.lookX = diff * 0.005; // 回転感度
        lastX = currentX;
    });
    lookZone.addEventListener('touchend', () => { window.gameState.input.lookX = 0; });

    // --- ボタン操作 ---
    const btnJump = document.getElementById('btn-jump');
    const btnFire = document.getElementById('btn-fire');

    btnJump.addEventListener('touchstart', () => window.gameState.input.isJumping = true);
    btnJump.addEventListener('touchend', () => window.gameState.input.isJumping = false);

    btnFire.addEventListener('touchstart', () => window.gameState.input.isFiring = true);
    btnFire.addEventListener('touchend', () => window.gameState.input.isFiring = false);
};
