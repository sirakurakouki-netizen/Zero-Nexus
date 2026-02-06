export class WindowManager {
    createWindow(id, title, content) {
        const win = document.createElement('div');
        win.className = 'nexus-window';
        win.style.cssText = `position:fixed; top:100px; left:100px; width:300px; height:200px; background:rgba(0,10,20,0.9); border:2px solid #00ffff; z-index:4000; display:flex; flex-direction:column;`;
        win.innerHTML = `
            <div class="win-header" style="background:#00ffff; color:#000; padding:5px; cursor:move; display:flex; justify-content:space-between;">
                <span>${title}</span>
                <button onclick="this.parentElement.parentElement.remove()">X</button>
            </div>
            <div style="flex:1;">${content}</div>
        `;
        document.body.appendChild(win);
        this.makeDraggable(win);
    }

    makeDraggable(win) {
        const header = win.querySelector('.win-header');
        const move = (e) => {
            const t = e.touches ? e.touches[0] : e;
            win.style.left = (t.clientX - 150) + 'px';
            win.style.top = (t.clientY - 10) + 'px';
        };
        header.ontouchmove = move;
        header.onmousemove = (e) => { if(e.buttons === 1) move(e); };
    }
}