const express = require('express');
const { DefaultAzureCredential } = require('@azure/identity');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
const port = 3000;

// Nome da conta e container
const accountName = 'testerafael';
const containerName = 'teste';

app.get('/', async (req, res) => {
  try {
    const credential = new DefaultAzureCredential();

    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobList = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      blobList.push(blob.name);
    }

    res.send(`
      <h2>✅ Blobs no container "${containerName}"</h2>
      <ul>
        ${blobList.map(name => `<li>${name}</li>`).join('')}
      </ul>
    `);
  } catch (error) {
    console.error('Erro ao acessar o Blob:', error.message);
    res.send(`<h2>❌ Erro ao acessar o Blob:</h2><pre>${error.message}</pre>`);
  }
});

app.listen(port, () => {
  console.log(`🚀 App rodando em http://localhost:${port}`);
});
