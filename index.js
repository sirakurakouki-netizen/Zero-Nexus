const express = require('express');
const axios = require('axios'); // プロキシ通信用
const path = require('path');
const app = express();
const port = 3000;

// publicフォルダを静的ファイルとして公開
app.use(express.static('public'));

/**
 * 🌐 Nexus Proxy Engine
 * 仮想ブラウザが制限を回避してサイトを読み込むためのエンドポイント
 */
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.send("No URL provided.");

    try {
        console.log(`[Proxy] Requesting: ${targetUrl}`);
        const response = await axios.get(targetUrl, {
            responseType: 'text',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // 取得したHTMLのリンクなどを相対パスから絶対パスに書き換える簡易処理
        // (本来はもっと複雑だが、まずは基礎を実装)
        let html = response.data;
        res.send(html);

    } catch (error) {
        res.status(500).send("Proxy Error: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`[Zero-Nexus] OS Server running at http://localhost:${port}`);
});