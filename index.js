const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/ping', (req, res) => res.json({ status: 'online' }));

// 強化プロキシ：サイトのソースを書き換えてリンクを維持する
app.get('/proxy', async (req, res) => {
    const target = req.query.url;
    if (!target) return res.send('No URL');
    try {
        const response = await axios.get(target, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        // 簡易的なHTML書き換え（相対パス対策）
        let data = response.data;
        if (typeof data === 'string') {
            const origin = new URL(target).origin;
            data = data.replace(/src="\//g, `src="${origin}/`);
            data = data.replace(/href="\//g, `href="${origin}/`);
        }
        res.send(data);
    } catch (e) {
        res.send(`Error: ${e.message}`);
    }
});

app.listen(PORT, () => console.log(`Zero-Nexus Node: ${PORT}`));