const ChatCustomeable = require('../CustomizerChat.js/Transform');
const {Templates, Personalities, Origins} = require('../utils/templates');
const Template = require("../models/Template");
const axios = require('axios');
const tokenizer = require('gpt-tokenizer');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.API_KEY_OPEN_AI,
  });
  const openai = new OpenAIApi(configuration);
  
const limit = 2500;
const getQueries = (queries, p, o, s, q ) => {
    data = p + o + s + q;
    data2 = ''
    queries.forEach((result, index) => {
        if(tokenizer.isWithinTokenLimit(data + result.text,limit)) {
            console.log(index);
            console.log(index + "  ", result.text);
            data += result.text;
            data2 += result.text;
        }
        else return;

    })

    return data2;
}

const makePrompt = (parameters) => {
    let text;
    const {description, style, data, input} = parameters;
    const personification = `Personifícate conforme al siguiente texto: ${description}.`
    const origin = `Tu origen es el siguiente: ${Origins[0].text}`;
    const styleResponse = `Tienes un estilo: ${style}. ${Personalities[style].descripcion}`;
    const dataTraining = getQueries(data, personification, origin, styleResponse, input);
    const training = `Usarás el siguiente texto como fuente de información, considera que es un catálogo de productos, cada uno tiene asignado un código formado por letras mayúsculas, seguidas de un guión y seguido por dígitos. Texto a analizar:${dataTraining}. `
    const question = `Finalmente responde a la pregunta: ${input}.`
    return personification + origin + styleResponse + training + question;
}

const Chat = async(req, res) => {
    try {
        const {input, style } = req.body;
        const idTemplate = req.body.idTemplate;
        let text = '';
        let response;
        if(idTemplate !== undefined)  {
            const query = await axios.post('https://api-retrieval.herokuapp.com/query',{
                queries: [{
                    "query": input,
                    "top_k": "5"
                }]
            });
            const template = await Template.findById(idTemplate);
            // let data = getQueries(query.data.results[0].results);
            const parameters = {
                description:template.description,
                style,
                data: query.data.results[0].results,
                input
            }
            const prompt = makePrompt(parameters);
            console.log(prompt);
            response = await ChatCustomeable.ChatBot(prompt);
        } else {
        }
     
        res.json({
            success: true,
            message: 'response obtained',
            statusCode: 200,
            data: response,
          });
    } catch (error) {
        if(error.data) console.log("sDASASA", error.data.response);

        if(error?.code){
              res.status(500).json({
            error: true,
            data:error.reason,
            message: 'The system cannot response, try later!',
            statusCode: 500,
            path: '/chat',
          });
        }
        console.log(error);
      
    }
}
module.exports = {
    Chat
}