const express = require('express');
const path = require('path');

const app = express();

// ルートにあるファイルを静的ファイルとして公開
app.use(express.static('.'));

// ルートアクセスでindex.htmlを返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ポート番号はReplitとFirebase両方に対応しやすい8080か3000を使用
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});