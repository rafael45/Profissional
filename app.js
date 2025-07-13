const express = require('express');
const { DefaultAzureCredential } = require('@azure/identity');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
const port = process.env.PORT || 3000;

// 🔐 Substitua com o nome da sua conta e container
const accountName = 'stfunctiontesterafaelrg'; // Nome da Storage Account
const containerName = 'teste1'; // Nome do container

// 🌐 Rota principal
app.get('/', async (req, res) => {
  try {
    const credential = new DefaultAzureCredential();
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
  } catch (error) {
    console.error('❌ Erro:', error.message);
    res.status(500).send(`❌ Erro ao acessar o Blob:\n\n${error.message}`);
  }
});

// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 App rodando em http://localhost:${port}`);
});
