const express = require('express');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

const app = express();
const port = 3000;

// Configurações da conta
const accountName = 'testerafael';
const accountKey = 'dSvCXSztNsU0uIyPlJWkTCLYNlcF6B9ql2q4MIclqSlv3xbxHW5hHjL4xDkjeVMt5zLdn7EFgwTq+AStCX9zgA==';
const containerName = 'teste';

// Cria cliente do Azure Blob Storage
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

app.get('/', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Lista os blobs no container
    let blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(blob.name);
    }

    res.send(`
      <h1>✅ Blobs no container "${containerName}"</h1>
      <ul>
        ${blobs.map(name => `<li>${name}</li>`).join('')}
      </ul>
    `);
  } catch (error) {
    console.error('Erro ao acessar o Blob:', error.message);
    res.status(500).send(`❌ Erro ao acessar o Blob: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`🚀 App rodando em http://localhost:${port}`);
});
