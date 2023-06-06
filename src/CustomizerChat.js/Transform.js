const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.API_KEY_OPEN_AI,
});
const openai = new OpenAIApi(configuration);


const ChatBot = (question) => {
    return new Promise(async(resolve, reject) => {
      let response;

      try {
        response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: question,
          temperature: 1,
          max_tokens: 1000,
        });
        if(response?.data?.choices?.length >0){
          resolve(response.data.choices[0].text)
        } else {
          reject({error:true, code:404, reason:'NO SE ENCONTRÓ UNA RESPUESTA'})
        }
      } catch (error) {
        reject({error:true, data:error})
        reject({error:true, code:500, reason: 'ERROR DEL SERVIDOR'})
      }
    
    })
   
}

module.exports = {
  ChatBot
};