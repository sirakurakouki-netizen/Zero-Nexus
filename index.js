const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json()); // ID/パスワード送信用

// 📡 ヘルスチェック (GitHackからの生存確認用)
app.get('/api/v1/health', (req, res) => {
    res.json({ status: "online", version: "1.8.0", timestamp: Date.now() });
});

// 🌐 プロキシ & 🎬 ストリーム (前回と同じ)
app.get('/api/v1/fetch', async (req, res) => {
    const encodedUrl = req.query.d;
    if (!encodedUrl) return res.status(400).send("No URL");
    try {
        const targetUrl = decodeURIComponent(Buffer.from(encodedUrl, 'base64').toString());
        const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (e) { res.status(500).send(e.message); }
});

app.get('/api/v1/stream', async (req, res) => {
    const encodedUrl = req.query.d;
    if (!encodedUrl) return res.status(400).send("No URL");
    try {
        const videoUrl = decodeURIComponent(Buffer.from(encodedUrl, 'base64').toString());
        res.setHeader('Content-Type', 'video/mp4');
        ytdl(videoUrl, { quality: 'highest', filter: 'audioandvideo' }).pipe(res);
    } catch (e) { res.status(500).send("Stream Error"); }
});

app.listen(port, () => console.log("Zero-Nexus Core: Online"));