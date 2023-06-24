import { PineconeClient } from "@pinecone-database/pinecone";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import readline from 'readline';
dotenv.config();

async function initializePineconeClient() {
    const client = new PineconeClient();
    await client.init({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT,
    });
    return client;
}

async function initializeVectorStore(client) {
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({ openAIApiKey: process.env.API_KEY_OPEN_AI }),
        { pineconeIndex }
    );
    return vectorStore;
}

async function initializeOpenAIModel() {
    return new OpenAI({ openAIApiKey: process.env.API_KEY_OPEN_AI, temperature: 1, modelName: 'text-davinci-003' });
}

async function fetchOpenAIData() {

    // console.log(`Inside fetch openaidata, and this is how the messages look uptil now:`)
    // for (let i = 0; i < messages.length; i++){
    //     console.log(messages[i])
    // }
    var apiKey = process.env.API_KEY_OPEN_AI;
    var apiUrl = 'https://api.openai.com/v1/chat/completions';
    var headers = {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
    };
    var data = {
        "model": "gpt-3.5-turbo",
        "temperature": 0,
        "messages": messages
    };
    var options = {
        'method': 'post',
        'headers': headers,
        'body': JSON.stringify(data)
    };
    var response = await fetch(apiUrl, options);
    // console.log(response)
    var jsonResponse = await response.json();
    return jsonResponse.choices[0].message.content;
}

async function getAnswersFromOpenAI(question) {
    if (messages.length > 4) {
        messages = [messages[0], messages[messages.length - 2], messages[messages.length - 1]];
    }

    messages.push({ "role": "user", "content": question });
    var answerGenerated = await fetchOpenAIData();
    messages.push({ "role": "assistant", "content": answerGenerated });
    return answerGenerated;
}

function runQuery(question) {
 return new Promise(async(resolve, reject) => {
    try {
        const client = await initializePineconeClient();
        const vectorStore = await initializeVectorStore(client);
        const model = await initializeOpenAIModel();
    
        /* Search the vector DB independently with meta filters */
        const results = await vectorStore.similaritySearch(question, 4);
    
        var results_concat = "";
    
        for (var i = 0; i < results.length; i++) {
            results_concat += results[i].pageContent;
            results_concat += "\n------------------------------------\n";
        }
    
        // console.log(results_concat);
    
        var answerGenerated = await getAnswersFromOpenAI(question.toLowerCase() + `\n\nThese are the products to consider while answering the user query related to any of the products:\n\n${results_concat}`); //These are the details of the 4 products to base your answer on if the query is related to any product. Each product is separated by a delimiter '-----'
    
        console.log(`Answer is: ${answerGenerated}\n`);
        resolve(answerGenerated)
    
      } catch (error) {
        console.log(error);
        reject(error)
      }
 })
}

var messages = [
    {
        "role": "system",
        "content": "Take on the role of Steren's AI assistant, known as Stebot. Ensure all interactions are in Spanish, including prices and numbers. Maintain your replies in a friendly and informal tone. Aim for brevity and humor in your responses. Share information derived from provided documents only when there's at least a 95% certainty of its accuracy in answering the user’s query. If in doubt, ask for further details. If an answer eludes you, respond with: 'Hmm, I've never been asked that before, but I'm taking note to get back to you very soon', and then request their name and email if they would like a follow-up when the appropriate answer is confirmed. Politely decline inquiries unrelated to the provided information. All cost references will be in Mexican pesos. When queried about specific quantities of products or items, express regret while explaining that such information frequently varies due to fluctuating inventory and the introduction of new lines. Lighten the situation with a polite, creative, and intriguing humorous comment to encourage continued interaction."
    }
];

// const question = "Could you give me the description for the CCTV-240?"; // Add your question here



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getUserQuestion() {
    return new Promise((resolve) => {
        rl.question('\nPlease enter your question: ', (question) => {
            resolve(question);
        });
    });
}

// (async function () {
//     while (true) {
//         const question = await getUserQuestion();
//         await runQuery(question);
//     }
// })();
export default runQuery;