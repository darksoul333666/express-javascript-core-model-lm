import { Templates, Personalities, Origins } from '../utils/templates.js';
import tokenizer from 'gpt-tokenizer';
import { Configuration, OpenAIApi } from 'openai';
import make from './Pinecone.js';

const configuration = new Configuration({
  apiKey: process.env.API_KEY_OPEN_AI,
});

const openai = new OpenAIApi(configuration);

const limit = 2000;

const getQueries = (queries, p, o, s, q) => {
  let data = p + o + s + q;
  let data2 = '';

  queries.forEach((result, index) => {
    if (tokenizer.isWithinTokenLimit(data + result.text, limit)) {
      console.log(index);
      console.log(index + '  ', result.text);
      data += result.text;
      data2 += result.text;
    } else {
      return;
    }
  });

  return data2;
};

const makePrompt = (parameters) => {
  const { description, style, data, input } = parameters;
  const personification = `Personifícate conforme al siguiente texto: ${description}.`;
  const origin = `Tu origen es el siguiente: ${Origins[0].text}`;
  const styleResponse = `Tienes un estilo: ${style}. ${Personalities['Amigable'].descripcion}`;
  const dataTraining = getQueries(data, personification, origin, styleResponse, input);
  const training = `Usarás el siguiente texto como fuente de información, considera que es un catálogo de productos, cada uno tiene asignado un código formado por letras mayúsculas, seguidas de un guión y seguido por dígitos. Texto a analizar:${dataTraining}. `;
  const question = `Finalmente responde a la pregunta: ${input}.`;

  return personification + origin + styleResponse + training + question;
};

const Chat = async (req, res) => {
  try {
    let response; 
    const query = `Actua como el robot de Steren. Tu nombre es Stebot, responde de manera amigable, siempre hablando de tu, y muy divertido y breve. 
     Proveerás información basada en los documentos provistos. Habla siempre en español y si no encuentras una respuesta a las preguntas, 
     responde exactamente: "hmmm, eso no me lo habían preguntado antes, pero estoy tomando nota para responderte muy pronto", y detente ahí. 
     Rechaza cualquier consulta que no sea sobre la información provista.
     Cuando respondas no respondas siempre presentándote a menos que hayas estado inactivo por más de 5 minutos y solo da dos recomendaciones de producto cuando aplique.
     Cuando te pregunten por una cantidad específica de productos o  piezas responde que lo sientes pero esa información es siempre variable por el 
     inventario y nuevas líneas y responde con un comentario chistoso que sea cortés, creativo e intrigue al usuario para seguir interactuando.
     RESPONDE a la siguente pregunta:${req.body.input}`;
     response = await make(query);

    // response =  makePrompt(req.body.input)
    res.json({
      success: true,
      message: 'response obtained',
      statusCode: 200,
      data: response,
    });
  } catch (error) {
    if (error.data) console.log('sDASASA', error.data.response);

    if (error?.code) {
      res.status(500).json({
        error: true,
        data: error.reason,
        message: 'The system cannot respond, try later!',
        statusCode: 500,
        path: '/chat',
      });
    }
    console.log(error);
  }
};

export default Chat
