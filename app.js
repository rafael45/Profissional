const express = require('express');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

const app = express();
const port = process.env.PORT || 3000;

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'testerafael';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = 'teste1'; // substitua se for outro container

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

app.get('/', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let blobList = '';
    for await (const blob of containerClient.listBlobsFlat()) {
      blobList += `✅ ${blob.name}<br>`;
    }
    res.send(`🎉 Blobs no container <strong>${containerName}</strong>:<br>${blobList}`);
  } catch (err) {
    console.error('Erro ao acessar o Blob:', err.message);
    res.status(500).send('Erro ao acessar o Blob: ' + err.message);
  }
});

app.listen(port, () => {
  console.log(`🚀 App online na porta ${port}`);
});
