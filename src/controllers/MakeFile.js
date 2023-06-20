import fs from 'fs';
import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { v4 as uuidv4 } from 'uuid';
import generateStringArray from './make.js';
dotenv.config();
// const readFileAndConvertToArray = (filename) => {
//   const fileContent = fs.readFileSync(filename, 'utf8');
//   const paragraphs = fileContent.split(/\n{2,}/); // Separar párrafos por dos o más saltos de línea

//   const paragraphObjects = [];

//   for (let i = 0; i < paragraphs.length; i++) {
//     const paragraph = paragraphs[i];
//     const lines = paragraph.split('\n');

//     let sku = '';
//     let producto = '';
//     let descripcion = '';

//     for (let j = 0; j < lines.length; j++) {
//       const line = lines[j];
//       if (line.startsWith('Sku:')) {
//         sku = line.trim();
//       } else if (line.startsWith('Producto:')) {
//         producto = line.trim();
//       } else if (line.startsWith('Descripcion:')) {
//         descripcion = line.trim();
//       }

//       if (j === lines.length - 1 || lines[j + 1].startsWith('Sku:')) {
//         paragraphObjects.push({
//           Sku: sku,
//           Producto: producto,
//           Descripcion: descripcion
//         });
//       }
//     }
//   }

//   return paragraphObjects;
// };

// Ejemplo de uso


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

// const returnArr = () => {
//     let arr = [];
//     const filename = '../../catalogoCam.txt'; // Reemplaza esto con la ruta y el nombre de tu archivo
//     const paragraphObjectsArray = readFileAndConvertToArray(filename);
//     for (const paragraphObject of paragraphObjectsArray) {
//         console.log(paragraphObject.Sku);
//         console.log(paragraphObject.Sku.slice(5, paragraphObject.Sku.length));
//         let sku = paragraphObject.Sku.slice(5, paragraphObject.Sku.length);
//         let descripcion = paragraphObject.Descripcion.slice(12, paragraphObject.Descripcion.length);
//         let producto = paragraphObject.Producto.slice(9, paragraphObject.Producto.length);
//         arr.push({sku: sku , data: `${sku} ${producto} ${descripcion} ` });
//       }
//       console.log(arr);

//     return arr;

//     // upload(generateStringArray())

// }

const returnArr = () => {
  let arr = [];
  const filename = '../../catalogoCam.txt'; // Reemplaza esto con la ruta y el nombre de tu archivo
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




const upload = async(arr) => {
    try {
        const client = new PineconeClient();

    await client.init({
      apiKey: "3557c927-c5dd-4e17-af59-c7376d7d2c6b",
      environment: "us-west4-gcp-free",
    });
    const pineconeIndex = client.Index("ai");
    const docs = [];
    arr.forEach(element => {
      console.log(concatenateValues(element).trim());
        docs.push(
            new Document({
                metadata: {sku:element.sku },
                pageContent: concatenateValues(element).trim(),
              })
        )

    })
        console.log(docs);
    await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings({openAIApiKey:"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"}), {
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

          result+=value.trim() + '. '
          // const trimmedValue = value.trim();
    
          // if (trimmedValue.endsWith('.')) {
          //   result += trimmedValue;
          // } else {
          //   result += trimmedValue + '.';
          // }
        }
      }
    
      return result.slice(0, -1); // Eliminar el último punto sobrante
    }

     upload(returnArr())