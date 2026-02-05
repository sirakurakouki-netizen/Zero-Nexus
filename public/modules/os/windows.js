export class WindowManager {
    constructor() {
        this.windows = [];
        this.zIndexCounter = 100;
    }

    /**
     * 新しいウィンドウを生成
     * @param {string} title - 窓のタイトル
     * @param {string} contentHtml - 中身（iframeやHTML）
     * @param {object} options - サイズや位置の指定
     */
    createWindow(title, contentHtml, options = { width: 320, height: 240, x: 20, y: 80 }) {
        const win = document.createElement('div');
        win.className = 'nexus-window';
        win.style.width = `${options.width}px`;
        win.style.height = `${options.height}px`;
        win.style.left = `${options.x}px`;
        win.style.top = `${options.y}px`;
        win.style.zIndex = this.zIndexCounter++;

        // ウィンドウ内部構造（日英併記思想の継承）
        win.innerHTML = `
            <div class="window-header">
                <span class="window-title">${title}</span>
                <div class="window-controls">
                    <button class="win-close">×</button>
                </div>
            </div>
            <div class="window-content">
                ${contentHtml}
            </div>
        `;

        document.getElementById('nexus-ui-layer').appendChild(win);
        this.makeDraggable(win);

        // 閉じるボタンのイベント
        win.querySelector('.win-close').onclick = () => {
            win.remove();
        };

        // クリックしたら最前面へ
        win.onmousedown = win.ontouchstart = () => {
            win.style.zIndex = this.zIndexCounter++;
        };

        this.windows.push(win);
        return win;
    }

    /**
     * スマホ/iPadタッチ対応のドラッグ機能
     */
    makeDraggable(el) {
        const header = el.querySelector('.window-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const dragStart = (e) => {
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            document.onmouseup = document.ontouchend = dragEnd;
            document.onmousemove = document.ontouchmove = dragProcess;
        };

        const dragProcess = (e) => {
            const touch = e.type === 'touchmove' ? e.touches[0] : e;
            pos1 = pos3 - touch.clientX;
            pos2 = pos4 - touch.clientY;
            pos3 = touch.clientX;
            pos4 = touch.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        };

        const dragEnd = () => {
            document.onmouseup = document.ontouchend = null;
            document.onmousemove = document.ontouchmove = null;
        };

        header.onmousedown = header.ontouchstart = dragStart;
    }

    /**
     * YouTube専用窓を起動
     */
    openYouTube(videoId) {
        const embedHtml = `
            <iframe width="100%" height="100%" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" allowfullscreen>
            </iframe>
        `;
        this.createWindow("Streaming / 映像再生", embedHtml, { width: 350, height: 220, x: 20, y: 100 });
    }
}