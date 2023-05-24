const mongoose = require('mongoose');

// Definir el esquema del modelo
const ProfileSchema = new mongoose.Schema({
    name: String,
    avatar: String,
    language: String,
    expressions: []
});

// Crear el modelo basado en el esquema
const Profile = mongoose.model('Profile', ProfileSchema);

// Exportar el modelo
module.exports = Profile;
