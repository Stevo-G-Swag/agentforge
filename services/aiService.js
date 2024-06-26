const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateCode(projectDescription) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates code based on project descriptions."
        },
        {
          role: "user",
          content: `Generate a code base for a project with the following description: ${projectDescription}`
        }
      ],
      temperature: 0.3,
      max_tokens: 4096,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating code:', error);
    console.error(error.stack);
    throw error;
  }
}

module.exports = generateCode;