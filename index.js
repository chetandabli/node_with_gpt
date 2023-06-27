const { Configuration, OpenAIApi } = require("openai");
const readline = require("readline");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const history = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getUserInput = () => {
  return new Promise((resolve) => {
    rl.question("Your input: ", (answer) => {
      resolve(answer);
    });
  });
};

const promptContinue = () => {
  return new Promise((resolve) => {
    rl.question("\nWould you like to continue the conversation? (Y/N) ", (answer) => {
      resolve(answer);
    });
  });
};

const chat = async () => {
  while (true) {
    const user_input = await getUserInput();

    const messages = [];
    for (const [input_text, completion_text] of history) {
      messages.push({ role: "user", content: input_text });
      messages.push({ role: "assistant", content: completion_text });
    }

    messages.push({ role: "user", content: user_input });

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      const completion_text = completion.data.choices[0].message.content;
      console.log(completion_text);

      history.push([user_input, completion_text]);

      const user_input_again = await promptContinue();
      if (user_input_again.toUpperCase() === "N") {
        rl.close();
        return;
      } else if (user_input_again.toUpperCase() !== "Y") {
        console.log("Invalid input. Please enter 'Y' or 'N'.");
        rl.close();
        return;
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      rl.close();
      return;
    }
  }
};

(async () => {
  await chat();
})();
