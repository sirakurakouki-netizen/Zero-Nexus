const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/proxy', async (req, res) => {
    let targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL");
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
            },
            timeout: 15000
        });

        let html = response.data;
        const origin = new URL(targetUrl).origin;
        const serverUrl = `https://${req.get('host')}`;

        // 🚀 Baseタグで画像・CSSのパスを解決
        html = html.replace(/<head>/i, `<head><base href="${origin}/">`);

        // 🚀 全てのリンク（href）をプロキシ経由に書き換え
        // aタグのhrefだけでなく、フォームのactionなども対象にする
        html = html.replace(/(href|action)="(https?:\/\/[^"]+)"/g, (match, p1, p2) => {
            return `${p1}="${serverUrl}/proxy?url=${encodeURIComponent(p2)}"`;
        });

        // 🚀 JavaScriptによる「iframe脱出」を防ぐ
        const antiLeak = `
            <script>
                // ページ遷移を監視し、すべてプロキシを通すように強制
                window.onbeforeunload = null;
                const originalOpen = window.open;
                window.open = (url) => {
                    const proxyUrl = "${serverUrl}/proxy?url=" + encodeURIComponent(url);
                    return originalOpen(proxyUrl, '_self');
                };
            </script>
        `;
        html = html.replace(/<\/head>/i, `${antiLeak}</head>`);

        res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        res.send(html);
    } catch (e) {
        res.status(500).send(`Proxy Error: ${e.message}`);
    }
});

// 次回、ここをytdl-coreで本気で実装する
app.get('/video-stream', (req, res) => res.send("Engine Updating..."));

app.listen(port, () => console.log("Nexus Server: Fully Armed"));