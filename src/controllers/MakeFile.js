import fs from 'fs';
import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { v4 as uuidv4 } from 'uuid';
import generateStringArray from './make.js';
dotenv.config();
const readFileAndConvertToArray = (filename) => {
  const fileContent = fs.readFileSync(filename, 'utf8');
  const paragraphs = fileContent.split(/\n{2,}/); // Separar párrafos por dos o más saltos de línea

  const paragraphObjects = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const lines = paragraph.split('\n');

    let sku = '';
    let producto = '';
    let descripcion = '';

    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      if (line.startsWith('Sku:')) {
        sku = line.trim();
      } else if (line.startsWith('Producto:')) {
        producto = line.trim();
      } else if (line.startsWith('Descripcion:')) {
        descripcion = line.trim();
      }

      if (j === lines.length - 1 || lines[j + 1].startsWith('Sku:')) {
        paragraphObjects.push({
          Sku: sku,
          Producto: producto,
          Descripcion: descripcion
        });
      }
    }
  }

  return paragraphObjects;
};

// Ejemplo de uso


const returnArr = () => {
    // let arr = [];
    // const filename = '../../catalogo.txt'; // Reemplaza esto con la ruta y el nombre de tu archivo
    // const paragraphObjectsArray = readFileAndConvertToArray(filename);
    // for (const paragraphObject of paragraphObjectsArray) {
    //     // console.log(paragraphObject.Sku);
    //     // console.log(paragraphObject.Sku.slice(5, paragraphObject.Sku.length));
    //     let sku = paragraphObject.Sku.slice(5, paragraphObject.Sku.length);
    //     let descripcion = paragraphObject.Descripcion.slice(12, paragraphObject.Descripcion.length);
    //     let producto = paragraphObject.Producto.slice(9, paragraphObject.Producto.length);
    //     arr.push({sku: sku , data: `${sku} ${producto} ${descripcion} ` });
    //   }
    // //return arr);

  console.log(generateStringArray());
    upload(generateStringArray())

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
        docs.push(
            new Document({
                metadata: { _id: uuidv4() },
                pageContent: element,
              })
        )

    })
        
    await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings({openAIApiKey:"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"}), {
      pineconeIndex,
    });
    console.log("exitoso");
    } catch (error) {
        console.log(error);
    }
    }


    returnArr()