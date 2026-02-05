const express = require('express');
const axios = require('axios');
const cors = require('cors');
// const ytdl = require('ytdl-core'); // 次回以降、これで動画を引っこ抜く
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/proxy', async (req, res) => {
    let targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL");
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

    try {
        const serverUrl = `https://${req.get('host')}`;
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            timeout: 10000
        });

        let html = response.data;
        const origin = new URL(targetUrl).origin;

        // 1. Baseタグ挿入（画像などの解決）
        html = html.replace(/<head>/i, `<head><base href="${origin}/">`);

        // 2. リンクの書き換え（魔法の一手）
        // ページ内の href="http..." を href="自分のプロキシ?url=http..." に置換する
        // これにより、ウィンドウ内のクリックもプロキシを通るようになる
        const proxyPrefix = `${serverUrl}/proxy?url=`;
        html = html.replace(/(href|src)="(https?:\/\/[^"]+)"/g, (match, p1, p2) => {
            return `${p1}="${proxyPrefix}${encodeURIComponent(p2)}"`;
        });

        res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
        res.send(html);
    } catch (e) {
        res.status(500).send(`Proxy Error: ${e.message}`);
    }
});

app.get('/video-stream', async (req, res) => {
    // 現在YouTube解析エンジンを再構築中
    res.send("YouTube Stream Engine: Initializing... Try again later.");
});

app.listen(port, () => console.log(`Nexus Server Online: ${port}`));