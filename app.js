const express = require('express');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

const app = express();
const port = process.env.PORT || 3000;

// Nome da conta e chave em variáveis de ambiente
const accountName    = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey     = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName  = process.env.AZURE_STORAGE_CONTAINER || 'teste1';

if (!accountName || !accountKey) {
  console.error('⚠️ AZURE_STORAGE_ACCOUNT_NAME ou AZURE_STORAGE_ACCOUNT_KEY não configuradas.');
  process.exit(1);
}

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient   = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

app.get('/', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let html = `<h2>✅ Blobs no container "${containerName}"</h2><ul>`;
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

app.listen(port, () => console.log(`🚀 App rodando na porta ${port}`));
