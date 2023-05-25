const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.API_KEY_OPEN_AI,
});
const openai = new OpenAIApi(configuration);

const ChatBot = async(question) => {
  let response;
  try {
     response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      temperature: 0,
      max_tokens: 1000,
    });
    console.log(response.data.choices[0].text);
  } catch (error) {
    console.log(error);
  }
 

return response.data.choices[0].text;
}

module.exports = {
  ChatBot
};