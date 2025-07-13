const express = require('express');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

const app = express();
const port = process.env.PORT || 3000;

// 🔐 Substitua com sua Account Name e Account Key
const accountName = 'stfunctiontesterafaelrg';
const accountKey = 'dSvCXSztNsU0uIyPlJWkTCLYNlcF6B9ql2q4MIclqSlv3xbxHW5hHjL4xDkjeVMt5zLdn7EFgwTq+AStCX9zgA==';
const containerName = 'teste1';

// 🔧 Configuração do cliente com chave da conta
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

app.get('/', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let list = '';

    for await (const blob of containerClient.listBlobsFlat()) {
      list += `🟢 ${blob.name}\n`;
    }

    res.send(`✅ Sucesso! Blobs no container "${containerName}":\n\n${list}`);
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(500).send(`❌ Erro ao acessar o Blob:\n\n${error.message || error}`);
  }
});

app.listen(port, () => {
  console.log(`🚀 App rodando em http://localhost:${port}`);
});
