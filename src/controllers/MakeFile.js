import fs from 'fs';
import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { v4 as uuidv4 } from 'uuid';

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
    let arr = [];
    const filename = '../../catalogo.txt'; // Reemplaza esto con la ruta y el nombre de tu archivo
    const paragraphObjectsArray = readFileAndConvertToArray(filename);
    for (const paragraphObject of paragraphObjectsArray) {
        // console.log(paragraphObject.Sku);
        // console.log(paragraphObject.Sku.slice(5, paragraphObject.Sku.length));
        let sku = paragraphObject.Sku.slice(5, paragraphObject.Sku.length);
        let descripcion = paragraphObject.Descripcion.slice(12, paragraphObject.Descripcion.length);
        let producto = paragraphObject.Producto.slice(9, paragraphObject.Producto.length);
        arr.push({sku: sku , data: `${sku} ${producto} ${descripcion} ` });
      }
    //return arr);
    upload(arr)

}

const upload = async(arr) => {
    try {
        const client = new PineconeClient();

    await client.init({
      apiKey: "eb053869-fd22-4814-bfc6-e61814333af6",
      environment: "us-west4-gcp-free",
    });
    const pineconeIndex = client.Index("ai");
    const docs = [];
    arr.forEach(element => {
        docs.push(
            new Document({
                metadata: { sku: element.sku },
                pageContent: element.data,
              })
        )

        console.log(element.sku);
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