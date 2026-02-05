const express = require('express');
const axios = require('axios');
const cors = require('cors');
const ytdl = require('ytdl-core'); // 解析エンジン有効化
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

// 通常のプロキシ（ブロックされやすいが、一般サイト用として残す）
app.get('/proxy', async (req, res) => {
    let targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL");
    try {
        const response = await axios.get(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 10000
        });
        res.send(response.data);
    } catch (e) {
        res.status(500).send("Proxy Error");
    }
});

// 🎬 【本命】YouTubeストリーミング解析エンドポイント
app.get('/video-stream', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send("No URL");

    try {
        // YouTubeの動画情報を取得
        const info = await ytdl.getInfo(videoUrl);
        // 最高画質かつビデオとオーディオが合体している形式を選択
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });

        if (!format) throw new Error("Format not found");

        console.log(`Streaming: ${info.videoDetails.title}`);

        // ヘッダーを設定して動画として流し込む
        res.setHeader('Content-Type', 'video/mp4');
        ytdl(videoUrl, { format: format }).pipe(res);

    } catch (e) {
        console.error("Stream Error:", e.message);
        res.status(500).send(`Stream Error: ${e.message}`);
    }
});

app.listen(port, () => console.log("Nexus Streaming Engine: Active"));