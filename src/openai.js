/* eslint-disable new-cap */
const {Configuration, OpenAIApi} = require("openai");
const dotenv = require("dotenv");
const {createReadStream} = require("fs");
const {roles} = require("./constants.js");

dotenv.config();

// eslint-disable-next-line require-jsdoc
function OpenAI(apiKey) {
  const configuration = new Configuration({apiKey});
  const openai = new OpenAIApi(configuration);
  // eslint-disable-next-line require-jsdoc
  async function chat(messages) {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      return response.data.choices[0].message;
    } catch (e) {
      console.log("Error while gpt chat", e.message);
    }
  }
  // eslint-disable-next-line require-jsdoc
  async function transcription(filepath) {
    try {
      const response = await openai.createTranscription(
          createReadStream(filepath),
          "whisper-1",
      );
      return response.data.text;
    } catch (e) {
      console.log("Error while transcription", e.message);
    }
  }
  return {chat, transcription, roles};
}

module.exports = {openai: OpenAI(process.env.OPENAI_KEY)};
