const express = require('express');
const axios = require('axios');
const cors = require('cors');
// const ytdl = require('ytdl-core'); // 将来的に使用。今はまずプロキシを治す
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

// 🚀 強化版プロキシ：ヘッダー偽装を強力に
app.get('/proxy', async (req, res) => {
    let targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL");
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
            },
            timeout: 10000
        });

        let html = response.data;
        const origin = new URL(targetUrl).origin;

        // 相対パスの破壊を防ぐため、より強力な置換を行う
        html = html.replace(/<head>/i, `<head><base href="${origin}/">`);

        // JSエラーによる画面真っ白を防ぐため、一部のセキュリティヘッダーを無効化して送る
        res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        res.send(html);
    } catch (e) {
        console.error("Proxy Error:", e.message);
        res.status(500).send(`Proxy Error: ${e.message}`);
    }
});

// 🎬 YouTubeストリーミング（仮：まずはエラー回避を優先）
app.get('/video-stream', async (req, res) => {
    const videoUrl = req.query.url;
    // ここに本格的なytdl解析を入れる準備
    res.status(501).send("Currently updating YouTube Engine...");
});

app.listen(port, () => {
    console.log(`Zero-Nexus Server: Online`);
    console.log(`Endpoint: ${port}`);
});