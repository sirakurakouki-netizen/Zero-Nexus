const express = require('express');
const axios = require('axios');
const cors = require('cors'); // 追加
const app = express();
const port = 3000;

// GitHackなどの外部ドメインからのアクセスを許可
app.use(cors());
app.use(express.static('public'));

app.get('/proxy', async (req, res) => {
    let targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL");
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

    try {
        const response = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 8000
        });

        let html = response.data;
        const origin = new URL(targetUrl).origin;
        const injection = `<base href="${origin}/">`;
        html = html.replace('<head>', `<head>${injection}`);

        res.setHeader('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval';");
        res.send(html);
    } catch (e) {
        res.status(500).send("Proxy Error");
    }
});

// ストリーミング中継
app.get('/video-stream', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send("No URL");
    try {
        const response = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream',
            headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.youtube.com/' }
        });
        res.setHeader('Content-Type', 'video/mp4');
        response.data.pipe(res);
    } catch (e) {
        res.status(500).send("Stream Error");
    }
});

app.listen(port, () => console.log(`Nexus Proxy Server is running on Replit!`));