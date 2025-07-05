require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/cypher-alpha:free', // Free model
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // Your domain or "localhost"
          'X-Title': 'My Chat App'
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Error talking to OpenAI' });
  }
});

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
