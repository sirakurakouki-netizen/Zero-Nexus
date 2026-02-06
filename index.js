const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/ping', (req, res) => res.json({ status: 'online' }));

// 聖典：超高速・多機能プロキシエンジン
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('URLが必要です');

    try {
        const response = await axios.get(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            timeout: 5000, // 5秒でタイムアウト（爆速維持）
            responseType: 'text'
        });

        let data = response.data;
        if (typeof data === 'string' && targetUrl.includes('http')) {
            const urlObj = new URL(targetUrl);
            const origin = urlObj.origin;

            // 聖典：リンクバイパス・プロトコル
            // CSS, JS, 画像などのパスを絶対パスに置換して読み込みエラーを防ぐ
            data = data.replace(/(src|href|action)="\//g, `$1="${origin}/`);

            // ページ内のリンクをクリックしてもプロキシが外れないように細工（将来の課題への布石）
            data += `<script>
                console.log("Nexus Proxy Injected");
                // ここに自動リンク書き換えスクリプトを後で追加可能
            </script>`;
        }

        res.send(data);
    } catch (e) {
        res.status(500).send(`Nexus Proxy Error: ${e.message}`);
    }
});

// 聖典：YouTubeダウンローダー・エンドポイント（簡易版）
// ※Replitに ytdl-core などの追加が必要だが、まずは構造を作る
app.get('/download', async (req, res) => {
    const videoId = req.query.id;
    // ここで動画ストリームをパイプ処理するコードを将来実装
    res.json({ message: "Downloader Ready", id: videoId, note: "ytdl-core implementation pending" });
});

app.listen(PORT, () => console.log(`🛡️ Nexus-Core: Multi-Proxy Online` ));