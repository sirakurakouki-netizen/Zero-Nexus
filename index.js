const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

// 🎬 YouTubeストリーミング（安定化版）
app.get('/video-stream', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send("No URL");

    try {
        // YouTube情報の取得にエージェント情報を偽装してブロック回避
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                }
            }
        });

        // iPhoneで見れる形式（mp4）を優先的に探す
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highest', 
            filter: 'audioandvideo' 
        });

        if (!format) throw new Error("No compatible format found");

        console.log(`Now Streaming: ${info.videoDetails.title}`);

        // ブラウザ側に動画であることを伝える
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Accept-Ranges', 'bytes');

        // ストリームを直接流し込む
        ytdl(videoUrl, { format: format }).pipe(res);

    } catch (e) {
        console.error("Stream Server Error:", e.message);
        res.status(500).json({ error: e.message });
    }
});

// ブラウザ（プロキシ）をより「透過的」にする
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL");
    try {
        const response = await axios.get(targetUrl, {
            responseType: 'arraybuffer', // バイナリで受け取る
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        res.set('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (e) {
        res.status(500).send("Proxy Blocked");
    }
});

app.listen(port, () => console.log("Nexus Server Re-Loaded"));