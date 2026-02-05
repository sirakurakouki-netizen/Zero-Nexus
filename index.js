const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

// 🛡️ 掟：GitHackからのアクセスを100%通すためのCORS全開放
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['*'],
    exposedHeaders: ['Content-Length', 'Content-Range', 'Accept-Ranges', 'Content-Type']
}));

app.use(express.static('public'));

// 🌐 プロキシ：i-フィルターとSafariの同時突破
app.get('/api/v1/fetch', async (req, res) => {
    const encodedUrl = req.query.d;
    if (!encodedUrl) return res.status(400).send("No URL Data");

    try {
        const targetUrl = decodeURIComponent(Buffer.from(encodedUrl, 'base64').toString());
        console.log(`[PROXING] ${targetUrl}`);

        const response = await axios.get(targetUrl, {
            responseType: 'arraybuffer',
            headers: { 
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
            }
        });

        res.set('Content-Type', response.headers['content-type'] || 'text/html');
        res.send(response.data);
    } catch (e) {
        console.error("Proxy Error:", e.message);
        res.status(500).send("Node Communication Error");
    }
});

// 🎬 YouTube：iOSが「本物の動画ストリーム」として認識する究極のヘッダー
app.get('/api/v1/stream', async (req, res) => {
    const encodedUrl = req.query.d;
    if (!encodedUrl) return res.status(400).send("No URL");

    try {
        const videoUrl = decodeURIComponent(Buffer.from(encodedUrl, 'base64').toString());
        console.log(`[STREAMING] ${videoUrl}`);

        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highest', 
            filter: 'audioandvideo', 
            format: 'mp4' 
        });

        // iOS Safariが要求する「部分的コンテンツ配信」のフリをする
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'no-store');

        const stream = ytdl(videoUrl, { format: format });
        stream.pipe(res);

        // 接続断絶時のクリーンアップ
        req.on('close', () => {
            if (stream.destroy) stream.destroy();
        });

    } catch (e) {
        console.error("Stream Error:", e.message);
        res.status(500).send("Stream Engine Error");
    }
});

app.listen(port, () => {
    console.log("------------------------------------");
    console.log("Zero-Nexus Backend Core: ACTIVE");
    console.log("------------------------------------");
});