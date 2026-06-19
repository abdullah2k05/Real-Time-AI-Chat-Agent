import "dotenv/config";
import Groq from "groq-sdk";
import express from "express";
import cors from "cors";
import session from "express-session";
import jwt from "jsonwebtoken";
import readline from "readline";

// Setup Grok
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
// Store Name from ENV
const Store_name = process.env.SHOP_NAME;

//System prompt to guide AI
const SYSTEM_PROMPT = `
You are a helpful customer support assistant for a store called ${Store_name}.
Be polite, short, and helpful.
If user asks irrelevant questions, guide them back to store support.
`;

console.log(`You are a helpful customer support assistant for a ${Store_name}`);

// ----------------AS WE SHIFTED FROM CLI TO EXPRESS ROUTE SO WE DISABLE IT -------------------------

// //Handle User INput via CLI
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

//Get input
// let userInput = "";
// function getUserInput() {
//   rl.question("You:", async (userInput) => {
//     if (userInput.toLowerCase() === "exit") {
//       console.log("Exiting...");
//       rl.close();
//       return;
//     }
//     await handelUserInput(userInput);
//     getUserInput();
//   });
// }

// Handle User input via CLI/Socket/Frontend
const handleUserInput = async (userInput) => {
  try {
    const responses = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userInput },
      ],
      model: "openai/gpt-oss-120b",
    });
    const response = responses.choices?.[0]?.message?.content;
    return response;
  } catch (err) {
    console.error("Error handling user input:", err);
  }
};


// getUserInput();

export { handleUserInput };
