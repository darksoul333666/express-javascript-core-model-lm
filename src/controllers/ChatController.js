const ChatCustomeable = require('../CustomizerChat.js/Transform');
const {Templates, Personalities} = require('../utils/templates');

const getConfigurations = (templateProfesion, templateStyle) => {
    try {
       return { descriptionProfesion: Templates[templateProfesion].preparation, 
             descriptionStyle: Personalities[templateStyle].descripcion }
    } catch (error) {
        console.log(error);
    }
  
}

const Chat = async(req, res) => {
    try {
        const {input, profesion, style } = req.body;
        const {descriptionProfesion, descriptionStyle} =  getConfigurations(profesion, style );

       const text = `Eres un ${profesion}: ${descriptionProfesion}, tienes un estilo de respuesta: ${style},  ${descriptionStyle}
        Responde la siguiente pregunta: ${input}`;
        const response = await ChatCustomeable.ChatBot(text);
        console.log(response);
        const question = {
            text: input,
            type: 'question'
        };
        const answer = {
            text: response,
            type: 'response'
        };

        res.json({
            success: true,
            message: 'response obtained',
            statusCode: 200,
            data: response,
          });
    } catch (error) {
        if(error.data) console.log("sDASASA", error.data);

        if(error?.code){
              res.status(error.code).json({
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