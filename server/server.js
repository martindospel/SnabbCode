import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const newConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(newConfiguration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Working...",
  });
});

app.post("/", async (req, res) => {
  try {
    //passing this prompt from textarea into the response
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      //higher temp value means more risk/randomness in the answer
      temperature: 0,
      //max number of tokens to generate
      max_tokens: 2048,
      top_p: 1,
      //asking the same question will not result in the same answer
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

app.listen(1234, () =>
  console.log("Server is running on port http://localhost:1234")
);
