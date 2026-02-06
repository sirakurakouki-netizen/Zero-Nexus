const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.static('public'));

// サイトのHTMLを取得するだけの超軽量プロキシ
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('URLが必要です');

    try {
        const response = await axios.get(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
            },
            timeout: 8000
        });
        res.send(response.data);
    } catch (e) {
        res.status(500).send(`アクセス不可: ${targetUrl} (サイト側が拒否しています)`);
    }
});

app.listen(3000, () => console.log('🛡️ Nexus Server: Low-Level Proxy Online'));