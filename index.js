const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));

// 🚀 動画ストリーム専用プロキシ
app.get('/video-stream', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send("No URL");

    try {
        // 動画のバイナリデータをストリーミングとして中継する
        const response = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.youtube.com/'
            }
        });

        res.setHeader('Content-Type', 'video/mp4');
        response.data.pipe(res);
    } catch (e) {
        res.status(500).send("Stream Error");
    }
});

// 通常のWebプロキシ
app.get('/proxy', async (req, res) => {
    let targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL");
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

    try {
        const response = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 8000
        });
        let html = response.data;
        const origin = new URL(targetUrl).origin;
        html = html.replace('<head>', `<head><base href="${origin}/">`);
        res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval';");
        res.send(html);
    } catch (e) {
        res.status(500).send("Proxy Error");
    }
});

app.listen(port, () => console.log(`Nexus Streaming Engine Online`));