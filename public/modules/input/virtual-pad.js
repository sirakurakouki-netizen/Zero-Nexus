export class VirtualPad {
    constructor() {
        this.container = null;
        this.stick = null;
        this.active = false;
        this.inputVector = { x: 0, y: 0 }; // 移動方向 (-1.0 ~ 1.0)
        this.touchId = null;
        this.startPos = { x: 0, y: 0 };
        this.currentPos = { x: 0, y: 0 };
        this.maxRadius = 50; // スティックの可動範囲
    }

    init() {
        this.container = document.getElementById('joystick-container');
        if (!this.container) return;

        // スティック本体（つまみ）の生成
        this.stick = document.createElement('div');
        this.stick.style.width = '50px';
        this.stick.style.height = '50px';
        this.stick.style.borderRadius = '50%';
        this.stick.style.background = 'rgba(0, 255, 255, 0.4)';
        this.stick.style.border = '2px solid #00ffff';
        this.stick.style.position = 'absolute';
        this.stick.style.top = '50%';
        this.stick.style.left = '50%';
        this.stick.style.transform = 'translate(-50%, -50%)';
        this.stick.style.pointerEvents = 'none'; // タッチ判定を邪魔しない
        this.container.appendChild(this.stick);

        // イベントリスナー登録（iOS/Android対応）
        this.container.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
        window.addEventListener('touchend', (e) => this.handleEnd(e));
    }

    handleStart(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        this.active = true;
        this.touchId = touch.identifier;

        const rect = this.container.getBoundingClientRect();
        this.startPos = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    handleMove(e) {
        if (!this.active) return;

        // 該当する指の動きを特定
        let touch = null;
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === this.touchId) {
                touch = e.touches[i];
                break;
            }
        }
        if (!touch) return;

        const dx = touch.clientX - this.startPos.x;
        const dy = touch.clientY - this.startPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        const clampedDist = Math.min(distance, this.maxRadius);
        const stickX = Math.cos(angle) * clampedDist;
        const stickY = Math.sin(angle) * clampedDist;

        // スティックの見た目を更新
        this.stick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;

        // 入力ベクトルを正規化して保持 (-1.0 ~ 1.0)
        this.inputVector.x = stickX / this.maxRadius;
        this.inputVector.y = stickY / this.maxRadius;
    }

    handleEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === this.touchId) {
                this.active = false;
                this.touchId = null;
                this.inputVector = { x: 0, y: 0 };
                // スティックを中心に戻す
                this.stick.style.transform = 'translate(-50%, -50%)';
                break;
            }
        }
    }

    // 外部（nexus-masterやplayer.js）から移動量を取得するためのメソッド
    getMovement() {
        return this.inputVector;
    }
}