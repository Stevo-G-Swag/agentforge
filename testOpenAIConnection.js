const OpenAI = require('openai');

// Option 1: Use an environment variable (recommended)
const apiKey = process.env.OPENAI_API_KEY;

// Option 2: Set your API key directly in the script (less secure)
// const apiKey = 'your_actual_api_key_here';

if (!apiKey) {
  console.error('Error: OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable or update the script with your API key.');
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

async function testAPI() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-05-13",
      messages: [{ role: "user", content: "Hello, world!" }],
      temperature: 0,
      max_tokens: 4095,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log('API Test Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('Failed to connect to OpenAI:', error);
    console.error(error.stack);
  }
}

testAPI();