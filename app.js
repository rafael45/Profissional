const express = require('express');
const { AzureCliCredential } = require('@azure/identity');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
const port = process.env.PORT || 3000;

// Altere conforme sua conta e container
const accountName = 'stfunctiontesterafaelrg';
const containerName = 'teste1';

app.get('/', async (req, res) => {
  try {
    const credential = new AzureCliCredential(); // para desenvolvimento local
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    let list = '';

    for await (const blob of containerClient.listBlobsFlat()) {
      list += `🟢 ${blob.name}\n`;
    }

    res.send(`✅ Sucesso! Blobs no container "${containerName}":\n\n${list}`);
  } catch (err) {
    console.error(err);
    res.status(500).send(`❌ Erro ao acessar o Blob:\n\n${err.message || err}`);
  }
});

app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`);
});
