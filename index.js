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
            timeout: 15000,
            validateStatus: false // エラーコードが返ってきても中身を表示する
        });

        let html = response.data;
        if (typeof html !== 'string') {
            return res.send("This content cannot be displayed as HTML.");
        }

        const origin = new URL(targetUrl).origin;

        // 🚀 強力なBaseタグ挿入
        html = html.replace(/<head>/i, `<head><base href="${origin}/">`);

        // 🚀 セキュリティガード（X-Frame-Optionsなど）を無効化するスクリプトを注入
        const injection = `
            <script>
                // リンククリックを全奪取してプロキシ経由にする
                document.addEventListener('click', e => {
                    const a = e.target.closest('a');
                    if (a && a.href && a.href.startsWith('http')) {
                        e.preventDefault();
                        window.location.href = window.location.origin + "/proxy?url=" + encodeURIComponent(a.href);
                    }
                }, true);
            </script>
        `;
        html = html.replace(/<\/head>/i, `${injection}</head>`);

        // ブラウザのブロックを避けるためのヘッダー
        res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        res.send(html);
    } catch (e) {
        res.status(500).send(`Proxy Error: ${e.message}`);
    }
});

app.listen(port, () => console.log(`Nexus Engine: Active`));