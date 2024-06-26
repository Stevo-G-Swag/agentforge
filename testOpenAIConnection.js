const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function testAPI() {
  try {
    const response = await openai.createCompletion({
      model: "gpt-4-turbo",
      prompt: "Hello, world!",
      max_tokens: 5
    });
    console.log('API Test Response:', response.data.choices[0].text);
  } catch (error) {
    console.error('Failed to connect to OpenAI:', error);
    console.error(error.stack);
  }
}

testAPI();
