const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const { SpeechClient } = require('@google-cloud/speech');
const { Storage } = require('@google-cloud/storage');

const router = express.Router();

// Initialize GCP storage
const storage = new Storage({
  keyFilename: process.env['GOOGLE_APPLICATION_CREDENTIALS'],
});

const bucketName = process.env['STORAGE_BUCKET_NAME'];
const bucket = storage.bucket(bucketName);
const upload = multer({ storage: multer.memoryStorage() });

// Initialize GCP Speech client
const speechClient = new SpeechClient({
  keyFilename: process.env['GOOGLE_APPLICATION_CREDENTIALS'],
});

// Transcribe endpoint
router.post('/transcribe', authMiddleware, async (req, res) => {
  try {
    const { audioUri } = req.body;

    const request = {
      audio: { uri: audioUri },
      config: {
        languageCode: 'en-US',
      },
    };

    // Initiate longrunningRecognize request
    const [operation] = await speechClient.longRunningRecognize(request);

    // Wait for the operation to complete
    const [response] = await operation.promise();

    // Collect the transcription
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join(' ');

    // Send the transcription back to the client
    res.json({ transcription });
  } catch (error) {
    console.error('Error handling the stream:', error);
    res.status(500).json({ error: 'Failed to handle audio stream' });
  }
});

// Upload audio endpoint
router.post(
  '/upload-audio',
  authMiddleware,
  upload.single('audio'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }

      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on('error', (err) => {
        res.status(500).send({ error: err.message });
      });

      blobStream.on('finish', () => {
        const gsUri = `gs://${bucketName}/${blob.name}`;
        res.status(200).send({ url: gsUri });
      });

      blobStream.end(req.file.buffer);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
