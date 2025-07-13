const express = require('express');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');

// Inicializa o Express
const app = express();
// Porta fornecida pelo Azure ou fallback local
const port = process.env.PORT || 3000;

// Nome da conta e chave de acesso (definidos como variáveis de ambiente no Azure)
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey  = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER || 'teste1';

// Validação básica
if (!accountName || !accountKey) {
  console.error('🚨 Variáveis de ambiente AZURE_STORAGE_ACCOUNT_NAME e AZURE_STORAGE_ACCOUNT_KEY não configuradas.');
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
    let html = `<h2>🎉 Blobs no container <strong>${containerName}</strong>:</h2><ul>`;

    for await (const blob of containerClient.listBlobsFlat()) {
      html += `<li>✅ ${blob.name}</li>`;
    }
    html += '</ul>';
    res.send(html);
  } catch (err) {
    console.error('Erro ao acessar o Blob:', err.message);
    res.status(500).send(`<p>❌ Erro ao acessar o Blob:</p><pre>${err.message}</pre>`);
  }
});

// Inicia servidor
app.listen(port, () => {
  console.log(`🚀 App rodando na porta ${port}`);
});

/**
 * NO AZURE:
 * 1) Defina as variáveis de ambiente no App Service:
 *    - AZURE_STORAGE_ACCOUNT_NAME = <nome_da_storage_account>
 *    - AZURE_STORAGE_ACCOUNT_KEY  = <chave_de_acesso>
 *    - AZURE_STORAGE_CONTAINER    = <nome_do_container> (opcional)
 * 2) Garanta que a publicação (por GitHub Actions ou ZIP deploy) inclua o app.js e package.json.
 * 3) Em Networking do Storage Account, libere acesso para as redes ou IPs do App Service.
 */
