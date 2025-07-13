const express = require('express');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

// Inicializa o Express
tconst app = express();
// Porta fornecida pelo Azure ou fallback local
const port = process.env.PORT || 3000;

// Nome da conta e chave de acesso (variáveis de ambiente no Azure)
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey  = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER || 'teste1';

// Validação básica
if (!accountName || !accountKey) {
  console.error('⚠️ Variáveis AZURE_STORAGE_ACCOUNT_NAME e _KEY não configuradas.');
  process.exit(1);
}

// Cria credencial e cliente do Blob Service
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// Rota raiz: lista blobs do container
app.get('/', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let html = `<h2>👍 Blobs no container <strong>${containerName}</strong>:</h2><ul>`;
    for await (const blob of containerClient.listBlobsFlat()) {
      html += `<li>🟢 ${blob.name}</li>`;
    }
    html += '</ul>';
    res.send(html);
  } catch (err) {
    console.error('Erro ao acessar o Blob:', err.message);
    res.status(500).send(`<p>❌ Erro ao acessar o Blob:</p><pre>${err.message}</pre>`);
  }
});

app.listen(port, () => {
  console.log(`🚀 App rodando em http://localhost:${port}`);
});
