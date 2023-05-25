const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text: String,
    type: String
    
});

const ChatSchema = new mongoose.Schema({
    templateId: String,
    messages: [MessageSchema]
    
});

module.exports = new mongoose.model('Chat', ChatSchema);

