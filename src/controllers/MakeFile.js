import fs from 'fs';
import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
dotenv.config();

const readFileAndConvertToArray = (filename) => {
  const fileContent = fs.readFileSync(filename, 'utf8');
  const paragraphs = fileContent.split(/\n{2,}/); // Separar párrafos por dos o más saltos de línea

  const paragraphObjects = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const lines = paragraph.split('\n');

    let sku = '';
    let nombre = '';
    let descripcion = '';
    let disenadaPara = '';
    let precio = '';
    let conexion = '';
    let tipoDeControl = '';
    let movimiento = '';
    let vision = '';
    let colocacionIdeal = '';
    let memoria = '';
    let compatibilidad = '';
    let calidadDeImagen = '';
    let audio = '';
    let intercomunicacion = '';
    let sugerenciaDeUso = '';
    let gama = '';

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      if (line.startsWith('Sku:')) {
        sku = line.trim();
      } else if (line.startsWith('Nombre:')) {
        nombre = line.trim();
      } else if (line.startsWith('Descripción breve:')) {
        descripcion = line.trim();
      } else if (line.startsWith('DISEÑADA PARA:')) {
        disenadaPara = line.trim();
      } else if (line.startsWith('PRECIO:')) {
        precio = line.trim();
      } else if (line.startsWith('CONEXIÓN:')) {
        conexion = line.trim();
      } else if (line.startsWith('TIPO DE CONTROL:')) {
        tipoDeControl = line.trim();
      } else if (line.startsWith('Movimiento:')) {
        movimiento = line.trim();
      } else if (line.startsWith('Visión:')) {
        vision = line.trim();
      } else if (line.startsWith('COLOCACIÓN IDEAL:')) {
        colocacionIdeal = line.trim();
      } else if (line.startsWith('MEMORIA:')) {
        memoria = line.trim();
      } else if (line.startsWith('COMPATIBILIDAD:')) {
        compatibilidad = line.trim();
      } else if (line.startsWith('CALIDAD DE IMAGEN:')) {
        calidadDeImagen = line.trim();
      } else if (line.startsWith('AUDIO:')) {
        audio = line.trim();
      } else if (line.startsWith('INTERCOMUNICACIÓN:')) {
        intercomunicacion = line.trim();
      } else if (line.startsWith('SUGERENCIA DE USO:')) {
        sugerenciaDeUso = line.trim();
      } else if (line.startsWith('GAMA:')) {
        gama = line.trim();
      }

      if (j === lines.length - 1 || lines[j + 1].startsWith('Sku:')) {
        paragraphObjects.push({
          Sku: sku,
          Nombre: nombre,
          Descripción: descripcion,
          'Diseñada Para': disenadaPara,
          Precio: precio,
          Conexión: conexion,
          'Tipo de Control': tipoDeControl,
          Movimiento: movimiento,
          Visión: vision,
          'Colocación Ideal': colocacionIdeal,
          Memoria: memoria,
          Compatibilidad: compatibilidad,
          'Calidad de Imagen': calidadDeImagen,
          Audio: audio,
          Intercomunicación: intercomunicacion,
          'Sugerencia de Uso': sugerenciaDeUso,
          Gama: gama
        });
      }
    }
  }

  return paragraphObjects;
};

const returnArr = () => {
  let arr = [];
  const filename = '../utils/files-training/catalogoCam.txt'; // Reemplaza esto con la ruta y el nombre de tu archivo
  const paragraphObjectsArray = readFileAndConvertToArray(filename);

  for (const paragraphObject of paragraphObjectsArray) {
    let sku = paragraphObject.Sku.slice(5, paragraphObject.Sku.length);
    let descripcion = paragraphObject['Descripción'];  //.slice(19, paragraphObject['Descripción'].length);
    let nombre = paragraphObject.Nombre.slice(8, paragraphObject.Nombre.length);
    let disenadaPara = paragraphObject['Diseñada Para'];
    let precio = paragraphObject.Precio;
    let conexion = paragraphObject.Conexión;
    let tipoDeControl = paragraphObject['Tipo de Control'];
    let movimiento = paragraphObject.Movimiento;
    let vision = paragraphObject.Visión;
    let colocacionIdeal = paragraphObject['Colocación Ideal'];
    let memoria = paragraphObject.Memoria;
    let compatibilidad = paragraphObject.Compatibilidad;
    let calidadDeImagen = paragraphObject['Calidad de Imagen'];
    let audio = paragraphObject.Audio;
    let intercomunicacion = paragraphObject.Intercomunicación;
    let sugerenciaDeUso = paragraphObject['Sugerencia de Uso'];
    let gama = paragraphObject.Gama;

    arr.push({
      sku: sku,
      data: `${sku} ${nombre} ${descripcion.toLowerCase()}`,
      'Diseñada Para': disenadaPara.toLowerCase(),
      Precio: precio,
      Conexión: conexion.toLowerCase(),
      'Tipo de Control': tipoDeControl.toLowerCase(),
      Movimiento: movimiento.toLowerCase(),
      Visión: vision.toLowerCase(),
      'Colocación Ideal': colocacionIdeal.toLowerCase(),
      Memoria: memoria.toLowerCase(),
      Compatibilidad: compatibilidad.toLowerCase(),
      'Calidad de Imagen': calidadDeImagen.toLowerCase(),
      Audio: audio.toLowerCase(),
      Intercomunicación: intercomunicacion.toLowerCase(),
      'Sugerencia de Uso': sugerenciaDeUso.toLowerCase(),
      Gama: gama.toLowerCase()
    });
  }
  console.log(arr);
  return arr;
}


const upload = async (arr) => {
  try {
    const client = new PineconeClient();
    await client.init({
      apiKey: PINECONE_API_KEY,
      environment: PINECONE_ENVIRONMENT,
    });
    const pineconeIndex = client.Index("ai");
    const docs = [];
    arr.forEach(element => {
      console.log(concatenateValues(element).trim());
      docs.push(
        new Document({
          metadata: { sku: element.sku },
          pageContent: concatenateValues(element).trim(),
        })
      )

    })
    await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: process.env.API_KEY_OPEN_AI }), {
      pineconeIndex,
    });
    console.log("exitoso");
  } catch (error) {
    console.log(error.response);
  }
}
function concatenateValues(obj) {
  let result = '';

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      result += value.trim() + '. '
    }
  }

  return result.slice(0, -1); 
}

upload(returnArr())