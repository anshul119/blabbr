const express = require('express');
const OpenAI = require('openai');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { url, transcript, story } = req.body;
    const [id] = await knex('stories').insert({ url, transcript, story });
    res.status(201).json({ id, url, transcript, story });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const story = await knex('stories').where({ id }).first();
    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ error: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { url, transcript, story } = req.body;
    const updated = await knex('stories')
      .where({ id })
      .update({ url, transcript, story });
    if (updated) {
      res.json({ id, url, transcript, story });
    } else {
      res.status(404).json({ error: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await knex('stories').where({ id }).del();
    if (deleted) {
      res.json({ message: 'Story deleted successfully' });
    } else {
      res.status(404).json({ error: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate story endpoint
router.post('/generate', authMiddleware, async (req, res) => {
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

    const story = response.choices[0].message.content.trim();
    res.json({ story });
  } catch (error) {
    console.error(
      'Error generating story post:',
      error.response ? error.response.data : error.message
    );
    res.status(500).send('Something went wrong!');
  }
});

module.exports = router;
