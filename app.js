// app.js
const express = require('express');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

const app = express();
const port = process.env.PORT || 3000;

// Lê variáveis de ambiente seguras
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!accountName || !accountKey || !containerName) {
  throw new Error("Variáveis de ambiente não definidas corretamente.");
}

// Cria credencial baseada na chave
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// Cria cliente do Blob Storage
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

app.get('/', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let list = '';
    for await (const blob of containerClient.listBlobsFlat()) {
      list += `\u2705 ${blob.name}\n`;
    }
    res.send(`\u2705 Blobs no container "${containerName}":\n\n${list}`);
  } catch (error) {
    console.error(error);
    res.status(500).send(`\u274C Erro ao acessar o Blob:\n\n${error.message || error}`);
  }
});

app.listen(port, () => {
  console.log(`\uD83D\uDE80 App rodando em http://localhost:${port}`);
});
