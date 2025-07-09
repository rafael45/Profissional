const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal — já renderiza o index.html automaticamente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`);
});
