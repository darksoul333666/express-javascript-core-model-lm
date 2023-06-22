import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import dotenv from 'dotenv';

dotenv.config();

async function initializePineconeClient() {
    const client = new PineconeClient();
    await client.init({
        apiKey: "3557c927-c5dd-4e17-af59-c7376d7d2c6b",
        environment: "us-west4-gcp-free",
    });
    return client;
}

async function initializeVectorStore(client) {
    const pineconeIndex = client.Index('ai');
    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({ openAIApiKey: "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" }),
        { pineconeIndex }
    );
    return vectorStore;
}

async function initializeOpenAIModel() {
    return new OpenAI({ openAIApiKey: "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", temperature: 0.1, modelName: 'gpt-3.5-turbo' });
}

async function runQuery(question) {
    
        return new Promise(async(resolve, reject) => {
            try {
                const client = await initializePineconeClient();
                const vectorStore = await initializeVectorStore(client);
                const model = await initializeOpenAIModel();
                const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
                    k: 2,
                    returnSourceDocuments: false,
                });
        
                const response = await chain.call({ query: question.toLowerCase() });
                console.log(response);
                resolve(response.text)
                return response.text;
            } catch (error) {
                console.log(error);
                reject(error.response)
            }
        })
}

// const question = "what is the price of cctv-848/hdd?"; // Add your question here

// runQuery(question)
//     .then(result => console.log("A",result))
//     .catch(error => console.error(error));

export default runQuery;