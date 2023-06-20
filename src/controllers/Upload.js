import { PineconeClient } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import returnArr from "./MakeFile.js";
dotenv.config();



const upload = async() => {
try {
    const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
const docs = [];
returnArr().forEach(element => {

  console.log(concatenateValues(element));
    // docs.push(
    //     new Document({
    //         metadata: { sku: element.sku },
    //         pageContent: element.data,
    //       })
    // )
})

// await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
//   pineconeIndex,
// });
} catch (error) {
    console.log(error);
}
}



export default upload