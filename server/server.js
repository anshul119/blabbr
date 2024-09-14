const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');
const { Storage } = require('@google-cloud/storage');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Adjust limit as needed

const port = 4000;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING
});

// Function to wait for database connection
const waitForDatabase = async () => {
  while (true) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connected');
      break;
    } catch (err) {
      console.log('Waiting for database...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

// Create the users table if it doesn't exist
const createUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Users table created or already exists');
};

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

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

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

app.post('/api/transcribe', async (req, res) => {
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

app.post('/api/generate-blog', async (req, res) => {
  const { rawText } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that reformats raw text into well-structured blog posts, you do not get carried away but stick to the main theme of the raw text, you correct the grammar but you do not change the raw ideas too much.',
        },
        {
          role: 'user',
          content: `I have a set of raw thoughts and ideas that I’d like to turn into a cohesive, well-structured, and engaging blog post. The raw thoughts do contain some pauses, sometimes mistakes and blabber, that should not be part of the final blog. Below are the main points and scattered ideas I want to include. Help me organize these thoughts into a compelling article that does not have too many grand words and feels very personal when someone reads it. Add relevant details, examples, and transitions to make the blog post flow smoothly and be engaging to readers. Here are my raw thoughts: ${rawText}`,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const blogPost = response.choices[0].message.content.trim();
    res.json({ blogPost });
  } catch (error) {
    console.error(
      'Error generating blog post:',
      error.response ? error.response.data : error.message
    );
    res.status(500).send('Something went wrong!');
  }
});

// Endpoint to upload audio
app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
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
});

// Start the server after database is ready
const startServer = async () => {
  await waitForDatabase();
  await createUsersTable();

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
};

startServer();
