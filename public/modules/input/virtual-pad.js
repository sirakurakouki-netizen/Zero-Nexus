export class VirtualPad {
    constructor(engine) {
        this.engine = engine;
        this.base = document.getElementById('joystick-base');
        this.stick = document.getElementById('joystick-stick');
        this.touchId = null;
    }

    init() {
        // スティック基部（左下）にタッチが始まった時だけ反応
        this.base.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            this.touchId = touch.identifier;
            this.handleInput(touch);
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            const touch = Array.from(e.touches).find(t => t.identifier === this.touchId);
            if (touch) {
                e.preventDefault();
                this.handleInput(touch);
            }
        }, { passive: false });

        const endHandler = (e) => {
            const touch = Array.from(e.changedTouches).find(t => t.identifier === this.touchId);
            if (touch) {
                this.touchId = null;
                this.stick.style.transform = `translate(0px, 0px)`;
                this.engine.inputVector.set(0, 0);
            }
        };

        window.addEventListener('touchend', endHandler);
        window.addEventListener('touchcancel', endHandler);
    }

    handleInput(touch) {
        const rect = this.base.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const limit = rect.width / 2;
        if (dist > limit) { dx *= limit / dist; dy *= limit / dist; }
        this.stick.style.transform = `translate(${dx}px, ${dy}px)`;
        this.engine.inputVector.set(dx / limit, dy / limit);
    }
}