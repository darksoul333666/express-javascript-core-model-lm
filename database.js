import mongoose from 'mongoose';
const connectDatabase = () => {
  const dbUrl = process.env.MONGO_DATABASE; // Accede a la variable de entorno
  // Conexión a la base de datos
  mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Conexión exitosa a la base de datos');
    })
    .catch((error) => {
      console.error('Error al conectar a la base de datos:', error);
    });
};

export default connectDatabase;
