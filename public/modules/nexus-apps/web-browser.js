export const WebBrowser = {
    launch(windowManager, config) {
        const proxyUrl = `${config.SERVER_URL}/proxy?url=`;
        const content = `
            <div style="display:flex; flex-direction:column; height:100%; background:#000;">
                <div style="display:flex; border-bottom:1px solid #00ffff;">
                    <input type="text" id="browser-url" placeholder="https://google.com" 
                           style="flex:1; background:#111; color:#0ff; border:none; padding:10px;">
                    <button id="browser-go" style="background:#0ff; color:#000; border:none; padding:10px; font-weight:bold;">GO</button>
                </div>
                <iframe id="browser-frame" style="flex:1; border:none; background:#fff;"></iframe>
            </div>
        `;
        windowManager.createWindow('app-browser', 'NEXUS-BROWSER (PROXY)', content);

        setTimeout(() => {
            const go = document.getElementById('browser-go');
            const input = document.getElementById('browser-url');
            const frame = document.getElementById('browser-frame');

            go.onclick = () => {
                const target = input.value.startsWith('http') ? input.value : 'https://' + input.value;
                frame.src = proxyUrl + encodeURIComponent(target);
            };
        }, 100);
    }
};