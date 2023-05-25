const ChatCustomeable = require('../CustomizerChat.js/Transform');
const ChatModel = require("../models/Chat");

const Chat = async(req, res) => {
    try {
        const {input, idTemplate} = req.body;
        const response = await ChatCustomeable.ChatBot(input);
        console.log(response);
        const question = {
            text: input,
            type: 'question'
        };
        const answer = {
            text: response,
            type: 'response'
        };
    //    let chat = await ChatModel.findById(idTemplate);
    //    const messages = [...chat.messages, question, response];
    //    chat.messages = messages;
    //    await chat.save();
        res.json({
            success: true,
            message: 'response obtained',
            statusCode: 200,
            data: response,
          });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error,
            message: 'The system cannot response, try later!',
            statusCode: 500,
            path: '/chat',
          });
    }
}
module.exports = {
    Chat
}