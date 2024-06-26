const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateCode(projectDescription) {
  try {
    const response = await openai.createCompletion({
      model: "gpt-4o",
      prompt: `Generate a code base for a project with the following description: ${projectDescription}`,
      max_tokens: 500
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error generating code:', error);
    console.error(error.stack);
    throw error;
  }
}

module.exports = { generateCode };
