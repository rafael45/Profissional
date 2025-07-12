const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Altere para seu container e storage
const blobUrl = 'https://testerafael.blob.core.windows.net/teste1?restype=container&comp=list';

app.get('/', async (req, res) => {
  try {
    // Obtem token via Managed Identity
    const tokenResponse = await axios.get(
      'http://169.254.169.254/metadata/identity/oauth2/token',
      {
        headers: { Metadata: 'true' },
        params: {
          'api-version': '2018-02-01',
          resource: 'https://storage.azure.com/'
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Faz chamada ao blob
    const blobResponse = await axios.get(blobUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-ms-version': '2021-04-10'
      }
    });

    res.send('✅ Sucesso! Acesso ao Blob realizado!\n\n' + blobResponse.data);
  } catch (error) {
    res.status(500).send(`❌ Falha no acesso ao Blob:\n\n${error.message}\n\n${error.response?.data || error}`);
  }
});

app.listen(port, () => {
  console.log(`App rodando em http://localhost:${port}`);
});
