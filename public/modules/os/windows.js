export class WindowManager {
    constructor() {
        this.container = document.getElementById('nexus-ui-layer');
    }

    createWindow(title, contentHtml, options = { width: 350, height: 300, x: 50, y: 50 }) {
        const win = document.createElement('div');
        win.className = 'nexus-window';
        win.style.width = `${options.width}px`;
        win.style.height = `${options.height}px`;
        win.style.left = `${options.x}px`;
        win.style.top = `${options.y}px`;

        win.innerHTML = `
            <div class="window-header">
                <span>${title}</span>
                <button class="close-btn" style="background:#000; border:none; color:#fff; width:24px; height:24px; border-radius:4px; font-weight:bold;">×</button>
            </div>
            <div class="window-content">${contentHtml}</div>
        `;

        this.container.appendChild(win);
        win.querySelector('.close-btn').onclick = () => win.remove();

        const header = win.querySelector('.window-header');

        // タッチ/マウス共通ドラッグ処理
        const onMove = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            win.style.left = `${clientX - win.dataset.offX}px`;
            win.style.top = `${clientY - win.dataset.offY}px`;
        };

        const onStart = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            win.dataset.offX = clientX - win.offsetLeft;
            win.dataset.offY = clientY - win.offsetTop;
            document.addEventListener(e.touches ? 'touchmove' : 'mousemove', onMove);
        };

        header.addEventListener('mousedown', onStart);
        header.addEventListener('touchstart', onStart);

        document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMove));
        document.addEventListener('touchend', () => document.removeEventListener('touchmove', onMove));

        return win;
    }
}