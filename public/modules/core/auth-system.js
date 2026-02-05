export class AuthSystem {
    constructor(master) {
        this.master = master;
    }

    init() {
        this.renderLoginOverlay();
    }

    renderLoginOverlay() {
        const html = `
            <div id="auth-overlay" style="position:fixed; top:0; left:0; width:100%; height:100%; background:#000; z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;">
                <div style="text-align:center; margin-bottom:40px;">
                    <h1 style="font-family:'Orbitron'; color:#0ff; font-size:28px; letter-spacing:4px; text-shadow:0 0 15px #0ff;">ZERO-NEXUS</h1>
                    <p style="font-family:'Orbitron'; color:#ff00ff; font-size:10px; margin-top:5px;">INFINITE SANDBOX OPERATING SYSTEM</p>
                </div>

                <div style="width:100%; max-width:300px; background:rgba(0,255,255,0.05); border:1px solid #0ff; padding:30px; border-radius:4px; box-shadow:0 0 20px rgba(0,255,255,0.1);">
                    <div style="margin-bottom:20px;">
                        <label style="color:#0ff; font-size:9px; display:block; margin-bottom:5px; font-family:'Orbitron';">USER ID</label>
                        <input id="login-id" type="text" placeholder="Enter ID..." style="width:100%; background:#000; border:none; border-bottom:1px solid #0ff; color:#fff; padding:10px; outline:none; font-family:sans-serif;">
                    </div>
                    <div style="margin-bottom:30px;">
                        <label style="color:#0ff; font-size:9px; display:block; margin-bottom:5px; font-family:'Orbitron';">ACCESS CODE</label>
                        <input id="login-pass" type="password" placeholder="••••••••" style="width:100%; background:#000; border:none; border-bottom:1px solid #0ff; color:#fff; padding:10px; outline:none;">
                    </div>

                    <button id="login-submit" style="width:100%; height:50px; background:#0ff; color:#000; border:none; font-family:'Orbitron'; font-weight:bold; letter-spacing:2px; cursor:pointer; transition:0.3s;">
                        SYSTEM_ACCESS()
                    </button>
                    <p id="auth-error" style="color:#f0f; font-size:10px; margin-top:15px; text-align:center; height:12px;"></p>
                </div>

                <p style="position:absolute; bottom:20px; color:#444; font-size:8px; font-family:'Orbitron';">© 2026 ZERO-PROJECT / ALL RIGHTS RESERVED.</p>
            </div>
        `;

        const root = document.getElementById('nexus-ui-root');
        root.insertAdjacentHTML('beforeend', html);

        const btn = document.getElementById('login-submit');
        btn.onclick = () => this.handleLogin();
    }

    handleLogin() {
        const id = document.getElementById('login-id').value;
        const pass = document.getElementById('login-pass').value;
        const error = document.getElementById('auth-error');

        // 🛡️ 聖典の「将来的に独自認証」を見据え、一旦は入力があれば成功とする
        if (id.trim().length > 0 && pass.trim().length > 0) {
            const overlay = document.getElementById('auth-overlay');
            overlay.style.opacity = '0';
            overlay.style.transition = '0.5s';

            setTimeout(() => {
                overlay.remove();
                this.master.onLoginSuccess(id);
            }, 500);
        } else {
            error.innerText = "ACCESS_DENIED: EMPTY_CREDENTIALS";
            // 揺れるエフェクトなどの遊びを入れたい場合はここに
        }
    }
}