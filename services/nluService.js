const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function handleNLU(inputText) {
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
          content: inputText
        }
      ],
      temperature: 0.3,
      max_tokens: 4096,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log("NLU Response:", response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in NLU handling:', error);
    console.error(error.stack);
    throw error;
  }
}

module.exports = handleNLU;