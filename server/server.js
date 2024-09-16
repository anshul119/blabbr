const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const authRoutes = require('./routes/auth');
const audioRoutes = require('./routes/audio');
const storyRoutes = require('./routes/story');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const port = 4000;

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

// Use routes
app.use('/api', authRoutes);
app.use('/api', audioRoutes);
app.use('/api', storyRoutes);

// Start the server after database is ready
const startServer = async () => {
  try {
    await pool.query('SELECT NOW()');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

startServer();
