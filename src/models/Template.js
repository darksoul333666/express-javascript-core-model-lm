const mongoose = require('mongoose');

// Definir el esquema del modelo
const TemplateSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    description: String,
    style:String,
    textTraining: String
});

module.exports = new mongoose.model('Template', TemplateSchema);

