const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: "./tgaibot.json",
});

// eslint-disable-next-line require-jsdoc
async function synthesizeSpeech(text, languageCode) {
  const request = {
    input: {text: text},
    voice: {languageCode: languageCode, ssmlGender: "MALE"},
    audioConfig: {audioEncoding: "OGG_OPUS"},
  };
  const [response] = await client.synthesizeSpeech(request);

  const outputFile = `./voices/last_AI_voices_message.ogg`;
  fs.writeFile(outputFile, response.audioContent, "binary", (err) => {
    if (err) {
      console.error("Error writing output file", err);
    } else {
      console.log(`Audio content written to file: ${outputFile}`);
    }
  });
  return outputFile;
}

module.exports = {synthesizeSpeech};
