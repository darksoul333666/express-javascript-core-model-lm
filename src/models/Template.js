const mongoose = require('mongoose');

// Definir el esquema del modelo
const TemplateSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    language: String,
    style:String,
    rol:String,
    expressions: []
});

module.exports = new mongoose.model('Template', TemplateSchema);

