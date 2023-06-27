const express = require("express");
const app = express();
const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
require("dotenv").config();

app.use(express.json());

// (async () => {
//     const configuration = new Configuration({
//       apiKey: process.env.OPENAI_API_KEY,
//     });
//     const openai = new OpenAIApi(configuration);
  
//     const history = [];
  
//     while (true) {
//       const user_input = readlineSync.question("Your input: ");
  
//       const messages = [];
//       for (const [input_text, completion_text] of history) {
//         messages.push({ role: "user", content: input_text });
//         messages.push({ role: "assistant", content: completion_text });
//       }
  
//       messages.push({ role: "user", content: user_input });
  
//       try {
//         const completion = await openai.createChatCompletion({
//           model: "gpt-3.5-turbo",
//           messages: messages,
//         });
  
//         const completion_text = completion.data.choices[0].message.content;
//         console.log(completion_text);
  
//         history.push([user_input, completion_text]);
  
//         const user_input_again = readlineSync.question(
//           "\nWould you like to continue the conversation? (Y/N)"
//         );
//         if (user_input_again.toUpperCase() === "N") {
//           return;
//         } else if (user_input_again.toUpperCase() !== "Y") {
//           console.log("Invalid input. Please enter 'Y' or 'N'.");
//           return;
//         }
//       } catch (error) {
//         if (error.response) {
//           console.log(error.response.status);
//           console.log(error.response.data);
//         } else {
//           console.log(error.message);
//         }
//       }
//     }
//   })();


  app.use(express.static("public"));

  app.post("/chat", async (req, res) => {
    try {
      // Get the user input from the request body
      const user_input = req.body.user_input;
  
      // Retrieve conversation history from the request body or initialize an empty array
      const history = req.body.history || [];
  
      const messages = [];
  
      // Iterate through the conversation history and add messages to the array
      for (const { role, content } of history) {
        messages.push({ role, content });
      }
  
      // Add the user input as a new message
      messages.push({ role: "user", content: user_input });
  
      // Create an instance of the OpenAI API
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
  
      // Make an API call to generate the AI response
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
  
      const completion_text = completion.data.choices[0].message.content;
  
      // Update the conversation history with the user input and AI response
      const updated_history = [...history, { role: "user", content: user_input }, { role: "assistant", content: completion_text }];
  
      // Send the AI-generated response back to the client
      res.json({ response: completion_text, history: updated_history });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
  

  app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
  });
  