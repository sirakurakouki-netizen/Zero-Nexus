const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/nexus-tunnel', async (req, res) => {
    let targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL provided.");
    if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

    try {
        const response = await axios.get(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
            }
        });
        // 余計な処理をせず、受け取ったデータをそのまま流す（バイパス）
        res.setHeader('Content-Type', response.headers['content-type']);
        res.send(response.data);
    } catch (e) {
        res.status(500).send("Tunnel Error: " + e.message);
    }
});

app.listen(port, () => console.log(`Nexus Server V3 Online`));