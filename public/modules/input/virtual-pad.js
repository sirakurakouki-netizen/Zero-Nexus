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
        // スティックの土台
        this.base = document.createElement('div');
        this.base.style.cssText = `position:fixed; bottom:50px; left:50px; width:120px; height:120px; background:rgba(0,255,255,0.1); border:2px solid #00ffff; border-radius:50%; z-index:9999; touch-action:none;`;

        this.stick = document.createElement('div');
        this.stick.style.cssText = `position:absolute; top:50%; left:50%; width:50px; height:50px; background:#00ffff; border-radius:50%; transform:translate(-50%,-50%); pointer-events:none;`;

        this.base.appendChild(this.stick);
        document.body.appendChild(this.base);
        this.setupEvents();
    }

    setupEvents() {
        const handleStart = (e) => {
            for (let t of e.changedTouches) {
                const rect = this.base.getBoundingClientRect();
                const dx = t.clientX - (rect.left + 60);
                const dy = t.clientY - (rect.top + 60);
                if (Math.sqrt(dx*dx + dy*dy) < 80) {
                    this.active = true;
                    this.touchId = t.identifier;
                } else {
                    this.lastX = t.clientX;
                    this.lastY = t.clientY;
                }
            }
        };

        const handleMove = (e) => {
            for (let t of e.touches) {
                if (t.identifier === this.touchId) {
                    const rect = this.base.getBoundingClientRect();
                    this.input.x = (t.clientX - (rect.left + 60)) / 60;
                    this.input.y = (t.clientY - (rect.top + 60)) / 60;
                    const d = Math.sqrt(this.input.x**2 + this.input.y**2);
                    if (d > 1) { this.input.x /= d; this.input.y /= d; }
                    this.stick.style.transform = `translate(calc(-50% + ${this.input.x * 60}px), calc(-50% + ${this.input.y * 60}px))`;
                } else {
                    this.lookInput.x = (t.clientX - this.lastX) * 0.005;
                    this.lookInput.y = (t.clientY - this.lastY) * 0.005;
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