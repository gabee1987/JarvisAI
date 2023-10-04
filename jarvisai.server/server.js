import OpenAI from "openai";
import express from "express";
import bodyParser from "body-parser";
// import cors from 'cors';

// require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
// app.use(cors());
app.use(bodyParser.json());

// OpenAI Configuration
const openai = new OpenAI({ apiKey: process.env.JARVISAI_API_KEY });

// Chat history to maintain context
const chatHistory = [];

app.post("/ask-jarvis", async (req, res) => {
  const user_input = req.body.message;

  // Prepare the message list with chat history
  const messageList = chatHistory.map(([input_text, completion_text]) => ({
    role: input_text === "user" ? "ChatGPT" : "user",
    content: input_text,
  }));
  messageList.push({ role: "user", content: user_input });

  try {
    const GPTOutput = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messageList,
    });

    const output_text = GPTOutput.data.choices[0].message.content;
    chatHistory.push([user_input, output_text]);

    res.json({ message: output_text });
  } catch (err) {
    if (err.response) {
      console.error(err.response.status);
      console.error(err.response.data);
      res.status(err.response.status).json(err.response.data);
    } else {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
