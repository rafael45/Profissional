const express = require('express');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

const app = express();
const port = process.env.PORT || 3000;

// 🔐 Pegando dados do ambiente
const accountName = process.env.ACCOUNT_NAME;
const accountKey = process.env.ACCOUNT_KEY;
const containerName = process.env.CONTAINER_NAME;

// Verificação básica
if (!accountName || !accountKey || !containerName) {
  console.error('❌ Variáveis de ambiente não definidas corretamente.');
  process.exit(1);
}

// 🔑 Cria credencial baseada na chave da conta
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

// 🔗 Cria cliente do serviço Blob
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// 🔁 Rota para listar blobs
app.get('/', async (req, res) => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let list = '';
    for await (const blob of containerClient.listBlobsFlat()) {
      list += `<li>📄 ${blob.name}</li>\n`;
    }

    res.send(`
      <h2>✅ Blobs no container "<strong>${containerName}</strong>"</h2>
      <ul>${list}</ul>
    `);
  } catch (error) {
    console.error('Erro ao acessar o Blob:', error.message || error);
    res.status(500).send(`
      <h2>❌ Erro ao acessar o Blob:</h2>
      <pre>${error.message || error}</pre>
    `);
  }
});

// ▶️ Inicia o servidor
app.listen(port, () => {
  console.log(`🚀 App rodando em http://localhost:${port}`);
});
