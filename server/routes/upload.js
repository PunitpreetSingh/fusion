import express from 'express';
import multer from 'multer';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const getGraphClient = () => {
  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID,
    process.env.AZURE_CLIENT_ID,
    process.env.AZURE_CLIENT_SECRET
  );

  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        const token = await credential.getToken('https://graph.microsoft.com/.default');
        return token.token;
      }
    }
  });
};

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const client = getGraphClient();
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const folderPath = process.env.ONEDRIVE_FOLDER_PATH || '/jive-migration';

    const uploadResult = await client
      .api(`/me/drive/root:${folderPath}/${fileName}:/content`)
      .put(req.file.buffer);

    const sharingLink = await client
      .api(`/me/drive/items/${uploadResult.id}/createLink`)
      .post({
        type: 'view',
        scope: 'anonymous'
      });

    res.json({
      url: sharingLink.link.webUrl,
      fileName: fileName,
      fileId: uploadResult.id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/batch', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const client = getGraphClient();
    const folderPath = process.env.ONEDRIVE_FOLDER_PATH || '/jive-migration';
    const results = [];

    for (const file of req.files) {
      const fileName = `${Date.now()}_${file.originalname}`;

      const uploadResult = await client
        .api(`/me/drive/root:${folderPath}/${fileName}:/content`)
        .put(file.buffer);

      const sharingLink = await client
        .api(`/me/drive/items/${uploadResult.id}/createLink`)
        .post({
          type: 'view',
          scope: 'anonymous'
        });

      results.push({
        url: sharingLink.link.webUrl,
        fileName: fileName,
        fileId: uploadResult.id
      });
    }

    res.json(results);
  } catch (error) {
    console.error('Batch upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
