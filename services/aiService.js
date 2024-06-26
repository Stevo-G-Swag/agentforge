const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateCode(projectDescription) {
  try {
    const response = await openai.Completion.create({
      model: "gpt-4o",
      prompt: `Generate a code base for a project with the following description: ${projectDescription}`,
      max_tokens: 500
    });
    return response.choices[0].text;
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}

module.exports = { generateCode };