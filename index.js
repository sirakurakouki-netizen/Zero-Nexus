const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

// すべてのドメイン（GitHack等）からの通信を許可
app.use(cors({ origin: '*' }));
app.use(express.static('public'));

// 🌐 プロキシ：URLの解釈をさらに強化
app.get('/api/v1/fetch', async (req, res) => {
    const encodedUrl = req.query.d;
    if (!encodedUrl) return res.status(400).send("No URL Data");

    try {
        const targetUrl = Buffer.from(encodedUrl, 'base64').toString();
        const response = await axios.get(targetUrl, {
            responseType: 'arraybuffer',
            headers: { 
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (e) {
        console.error("Proxy Error:", e.message);
        res.status(500).send(`Proxy Failure: ${e.message}`);
    }
});

// 🎬 YouTube：iOS Safariが「本物の動画」だと信じるためのヘッダーを付与
app.get('/api/v1/stream', async (req, res) => {
    const encodedUrl = req.query.d;
    if (!encodedUrl) return res.status(400).send("No URL");

    try {
        const videoUrl = Buffer.from(encodedUrl, 'base64').toString();
        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highest', 
            filter: 'audioandvideo', 
            format: 'mp4' 
        });

        // iOS向けの魔法のヘッダー
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-cache');

        ytdl(videoUrl, { format: format }).pipe(res);
    } catch (e) {
        console.error("Stream Error:", e.message);
        res.status(500).send("Stream Error");
    }
});

app.listen(port, () => console.log("Nexus Core: Deep Communication Ready"));