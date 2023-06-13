import mongoose from 'mongoose';

// Definir el esquema del modelo
const TemplateSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  description: String,
  style: String,
  textTraining: String
});

export default mongoose.model('Template', TemplateSchema);
