// 聖典：Zero-Nexus 操作プロトコル（iOS最適化済）
export class VirtualPad {
    constructor() {
        this.active = false;
        this.input = { x: 0, y: 0 };
        this.lookInput = { x: 0, y: 0 };
        this.touchId = null;
        this.lastX = 0;
        this.lastY = 0;
    }

    init() {
        // スティック外枠
        this.base = document.createElement('div');
        this.base.style.cssText = `position:fixed; bottom:60px; left:60px; width:120px; height:120px; 
            background:rgba(0,255,255,0.05); border:2px solid #00ffff; border-radius:50%; z-index:2000; touch-action:none;`;

        // スティック本体
        this.stick = document.createElement('div');
        this.stick.style.cssText = `position:absolute; top:50%; left:50%; width:50px; height:50px; 
            background:#00ffff; border-radius:50%; transform:translate(-50%,-50%); pointer-events:none; box-shadow:0 0 15px #00ffff;`;

        this.base.appendChild(this.stick);
        document.body.appendChild(this.base);
        this.setupEvents();
    }

    setupEvents() {
        const handleStart = (e) => {
            for (let t of e.changedTouches) {
                const rect = this.base.getBoundingClientRect();
                const centerX = rect.left + 60;
                const centerY = rect.top + 60;
                const dist = Math.sqrt((t.clientX - centerX)**2 + (t.clientY - centerY)**2);

                if (dist < 100 && this.touchId === null) {
                    this.active = true;
                    this.touchId = t.identifier;
                } else {
                    // 画面右側などは視点操作
                    this.lastX = t.clientX;
                    this.lastY = t.clientY;
                }
            }
        };

        const handleMove = (e) => {
            e.preventDefault();
            for (let t of e.touches) {
                if (t.identifier === this.touchId) {
                    const rect = this.base.getBoundingClientRect();
                    this.input.x = (t.clientX - (rect.left + 60)) / 60;
                    this.input.y = (t.clientY - (rect.top + 60)) / 60;

                    const d = Math.sqrt(this.input.x**2 + this.input.y**2);
                    if (d > 1) { this.input.x /= d; this.input.y /= d; }

                    this.stick.style.transform = `translate(calc(-50% + ${this.input.x * 60}px), calc(-50% + ${this.input.y * 60}px))`;
                } else {
                    // 視点操作（感度調整）
                    this.lookInput.x = (t.clientX - this.lastX) * 0.006;
                    this.lookInput.y = (t.clientY - this.lastY) * 0.006;
                    this.lastX = t.clientX;
                    this.lastY = t.clientY;
                }
            }
        };

        const handleEnd = (e) => {
            for (let t of e.changedTouches) {
                if (t.identifier === this.touchId) {
                    this.active = false;
                    this.touchId = null;
                    this.input = { x: 0, y: 0 };
                    this.stick.style.transform = `translate(-50%, -50%)`;
                }
            }
        };

        window.addEventListener('touchstart', handleStart, {passive: false});
        window.addEventListener('touchmove', handleMove, {passive: false});
        window.addEventListener('touchend', handleEnd);
    }
}