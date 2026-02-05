export class VirtualPad {
    constructor() {
        this.base = document.getElementById('v-pad-base');
        this.stick = document.getElementById('v-pad-stick');
        this.input = { x: 0, y: 0 };
        this.active = false;
    }

    init() {
        const handleStart = (e) => {
            this.active = true;
            handleMove(e);
        };

        const handleMove = (e) => {
            if (!this.active) return;
            const touch = e.touches ? e.touches[0] : e;
            const rect = this.base.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const maxDist = rect.width / 2;

            if (dist > maxDist) {
                dx *= maxDist / dist;
                dy *= maxDist / dist;
            }

            this.stick.style.transform = `translate(${dx}px, ${dy}px)`;
            this.input.x = dx / maxDist;
            this.input.y = dy / maxDist;
        };

        const handleEnd = () => {
            this.active = false;
            this.stick.style.transform = `translate(0px, 0px)`;
            this.input = { x: 0, y: 0 };
        };

        this.base.addEventListener('touchstart', handleStart);
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', handleEnd);

        this.base.addEventListener('mousedown', handleStart);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);
    }

    getMovement() { return this.input; }
}