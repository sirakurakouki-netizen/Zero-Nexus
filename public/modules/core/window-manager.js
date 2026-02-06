export class WindowManager {
    constructor() {
        this.windows = [];
    }

    createWindow(title, contentUrl) {
        const win = document.createElement('div');
        win.className = 'nexus-window';
        win.style.cssText = `width:350px; height:220px; top:80px; left:20px; z-index:5000; pointer-events:auto;`;

        win.innerHTML = `
            <div class="window-header" style="user-select:none; -webkit-user-select:none;">
                <span>${title}</span>
                <button class="win-close" style="background:none; border:none; color:#fff; font-size:20px;">×</button>
            </div>
            <div class="window-body" style="flex:1; background:#000;">
                <iframe src="${contentUrl}" 
                    style="width:100%; height:100%; border:none;" 
                    allow="autoplay; encrypted-media; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `;

        document.body.appendChild(win);
        win.querySelector('.win-close').onclick = () => win.remove();
        this.makeDraggable(win);
    }

    makeDraggable(el) {
        const header = el.querySelector('.window-header');
        let offsetX, offsetY;

        header.addEventListener('touchstart', (e) => {
            offsetX = e.touches[0].clientX - el.offsetLeft;
            offsetY = e.touches[0].clientY - el.offsetTop;
        }, {passive: true});

        header.addEventListener('touchmove', (e) => {
            el.style.left = (e.touches[0].clientX - offsetX) + 'px';
            el.style.top = (e.touches[0].clientY - offsetY) + 'px';
        }, {passive: true});
    }
}