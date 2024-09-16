const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

// Generate story endpoint
router.post('/generate-story', async (req, res) => {
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
